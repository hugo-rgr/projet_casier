import { Router, Request, Response } from 'express';
import User from '../models/User';

const router = Router();

// Create a new user
router.post('/', async (req: Request, res: Response) => {
    try {
        const newUser = new User(req.body);
        const userRegistered = await newUser.save();
        res.status(200).json(userRegistered);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users
router.get('/', async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Get a user by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        //if (!user) {
        //    return res.status(404).json({ error: 'User not found' });
        //}
        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Update a user by ID
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a user by ID
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedUser);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
