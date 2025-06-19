import { Request, Response } from 'express';
import User from '../models/User.model';
import {AuthenticatedRequest} from "../middlewares/auth.middleware";

 export class UserController {
    async createUser(req: AuthenticatedRequest, res: Response) {
        try {

            const newUser = new User(req.body);
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getUser(req: AuthenticatedRequest, res: Response) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                 res.status(404).json({ error: 'User not found' });
                    return;
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }



     async getMyUser(req: AuthenticatedRequest, res: Response) {
         try {
             const userId = req.user?.userId;
             const user = await User.findById(userId);
             if (!user) {
                 res.status(404).json({ error: 'User not found' });
                 return;
             }
             res.json(user);
         } catch (error) {
             res.status(500).json({ error: (error as Error).message });
         }
     }


     async getAllUsers(req: Request, res: Response) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!user) {
                 res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                 res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

}

export const userController = new UserController();




