import { Request, Response } from 'express';
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/email';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import {UserRole} from "../types";
import {generateToken} from "../middlewares/auth.middleware";

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { email, password, firstname, lastname, phone, role, ...additional_info } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
                return;
            }

            // Generate verification code
            const verification_code = Math.random().toString(36).substring(2, 8).toUpperCase();
            const hashed_password = await bcrypt.hash(password, 10);

            // Create new user with verification code
            const newUser = new User({
                email,
                password: hashed_password,
                firstname,
                lastname,
                phone,
                role: role ?? UserRole.CLIENT,
                is_email_verified: false,
                email_verification_token: verification_code,
                email_verification_token_expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
                ...additional_info
            });

            await newUser.save();

            // Send verification email
            await sendVerificationEmail(email, verification_code, firstname);

            res.status(201).json({
                message: 'Un code de vérification a été envoyé à votre adresse email'
            });
        } catch (error: any) {
            if (error.code === 11000) {
                res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
                return;
            }
            res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
        }
    }

    async verifyEmail(req: Request, res: Response) {
        try {
            const { email, code } = req.body;

            const user = await User.findOne({
                email,
                email_verification_token: code
            });

            if (!user) {
                res.status(400).json({ message: 'Code invalide' });
                return;
            }

            if (!user.email_verification_token_expires || new Date(user.email_verification_token_expires) < new Date()) {
                res.status(400).json({ message: 'Code expiré' });
                return;
            }

            // Update user verification status and clear verification token
            user.is_email_verified = true;
            user.email_verification_token = undefined;
            user.email_verification_token_expires = undefined;
            await user.save();

            // Send welcome email
            await sendWelcomeEmail(email, user.firstname);

            res.json({ message: 'Email vérifié avec succès' });
        } catch (error: any) {
            res.status(500).json({ message: 'Erreur lors de la vérification', error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                res.status(401).json({ message: 'Identifiants invalides' });
                return;
            }

            if (!user.is_email_verified) {
                res.status(401).json({ message: 'Email non vérifié' });
                return;
            }

            const is_valid_password = await bcrypt.compare(password, user.password);
            if (!is_valid_password) {
                res.status(401).json({ message: 'Identifiants invalides' });
                return;
            }

            /*const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: '24h' }
            );*/

            const token =  generateToken(user.id, user.role);

            res.json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstname,
                    lastName: user.lastname,
                    role: user.role
                }
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
        }
    }

    async requestPasswordReset(req: Request, res: Response) {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                // For security reasons, return the same message even if email doesn't exist
                res.json({
                    message: 'Si un compte existe avec cet email, un code de réinitialisation sera envoyé.'
                });
                return;
            }

            // Generate new reset code
            const reset_code = Math.random().toString(36).substring(2, 8).toUpperCase();

            // Update user with reset code
            user.email_verification_token = reset_code;
            user.email_verification_token_expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
            await user.save();

            // Send password reset email
            await sendPasswordResetEmail(email, reset_code, user.firstname);

            res.json({
                message: 'Si un compte existe avec cet email, un code de réinitialisation sera envoyé.'
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation', error: error.message });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const { email, code, new_password } = req.body;

            const user = await User.findOne({
                email,
                email_verification_token: code
            });

            if (!user) {
                res.status(400).json({ message: 'Code invalide' });
                return;
            }

            if (!user.email_verification_token_expires || new Date(user.email_verification_token_expires) < new Date()) {
                res.status(400).json({ message: 'Code expiré' });
                return;
            }

            // Hash new password
            const hashed_password = await bcrypt.hash(new_password, 10);

            // Update password and clear reset token
            user.password = hashed_password;
            user.email_verification_token = null;
            user.email_verification_token_expires = null;
            await user.save();

            res.json({ message: 'Mot de passe réinitialisé avec succès' });
        } catch (error: any) {
            res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe', error: error.message });
        }
    }

    // Additional method to resend verification code
    async resendVerificationCode(req: Request, res: Response) {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }

            if (user.is_email_verified) {
                res.status(400).json({ message: 'Email déjà vérifié' });
                return;
            }

            // Generate new verification code
            const verification_code = Math.random().toString(36).substring(2, 8).toUpperCase();

            // Update user with new verification code
            user.email_verification_token = verification_code;
            user.email_verification_token_expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
            await user.save();

            // Send verification email
            await sendVerificationEmail(email, verification_code, user.firstname);

            res.json({
                message: 'Un nouveau code de vérification a été envoyé à votre adresse email'
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Erreur lors de l\'envoi du code', error: error.message });
        }
    }
}

export const authController = new AuthController();
