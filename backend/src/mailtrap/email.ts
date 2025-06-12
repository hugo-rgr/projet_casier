import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    LOCKER_RESERVATION_SUCCESS_TEMPLATE,
    LOCKER_RESERVATION_EXPIRED_TEMPLATE,
    LOCKER_RESERVATION_EXPIRATION_REMINDER_TEMPLATE
} from "./templates";

import { mailtrapClient, sender } from "./config";

export const sendVerificationEmail = async (email: string, verificationToken: string, username: string) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE
                .replace("{verificationCode}", verificationToken)
                .replace("{username}", username),
            category: "Email Verification",
        });

        console.log("Verification email sent successfully", response);
    } catch (error) {
        console.error("Error sending verification email", error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const sendWelcomeEmail = async (email: string, username: string) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Congratulations",
            html: WELCOME_EMAIL_TEMPLATE.replace("{username}", username),
        });

        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.error("Error sending welcome email", error);
        throw new Error(`Error sending welcome email: ${error}`);
    }
};

export const sendPasswordResetEmail = async (email: string, resetToken: string, username: string) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE
                .replace("{resetToken}", resetToken)
                .replace("{username}", username),
            category: "Password Reset",
        });

        console.log("Password reset email sent successfully", response);
    } catch (error) {
        console.error("Error sending password reset email", error);
        throw new Error(`Error sending password reset email: ${error}`);
    }
};

export const sendResetSuccessEmail = async (email: string) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",
        });

        console.log("Password reset success email sent successfully", response);
    } catch (error) {
        console.error("Error sending password reset success email", error);
        throw new Error(`Error sending password reset success email: ${error}`);
    }
};

export const sendLockerReservationSuccessEmail = async (
    email: string,
    username: string,
    lockerNumber: string,
    startDate: string,
    endDate: string

) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Locker Reservation Confirmed",
            html: LOCKER_RESERVATION_SUCCESS_TEMPLATE
                .replace("{username}", username)
                .replace("{lockerNumber}", lockerNumber)
                .replace("{startDate}", startDate)
                .replace("{endDate}", endDate),
            category: "Locker Reservation",
        });

        console.log("Locker reservation success email sent", response);
    } catch (error) {
        console.error("Error sending locker reservation success email", error);
        throw new Error(`Error sending locker reservation success email: ${error}`);
    }
};

export const sendLockerReservationExpiredEmail = async (
    email: string,
    username: string,
    lockerNumber: string
) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Locker Reservation Expired",
            html: LOCKER_RESERVATION_EXPIRED_TEMPLATE
                .replace("{username}", username)
                .replace("{lockerNumber}", lockerNumber),
            category: "Locker Reservation",
        });

        console.log("Locker reservation expired email sent", response);
    } catch (error) {
        console.error("Error sending locker reservation expired email", error);
        throw new Error(`Error sending locker reservation expired email: ${error}`);
    }
};


export const sendLockerReservationExpirationReminderEmail = async (
    email: string,
    username: string,
    lockerNumber: string,
    expirationTime: string
) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Rappel : Votre réservation de casier expire bientôt",
            html: LOCKER_RESERVATION_EXPIRATION_REMINDER_TEMPLATE
                .replace("{username}", username)
                .replace("{lockerNumber}", lockerNumber)
                .replace("{expirationTime}", expirationTime),
            category: "Rappel expiration réservation casier",
        });

        console.log("Email de rappel d’expiration envoyé avec succès", response);
    } catch (error) {
        console.error("Erreur lors de l’envoi de l’email de rappel d’expiration", error);
        throw new Error(`Erreur lors de l’envoi de l’email de rappel d’expiration : ${error}`);
    }
};
