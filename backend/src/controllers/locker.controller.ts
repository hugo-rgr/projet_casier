import { Request, Response } from 'express';
import Locker from '../models/Locker.model';
import {AuthenticatedRequest} from "../middlewares/auth.middleware";
import {LockerStatus} from "../types";

 export class LockerController {
    async createLocker(req: AuthenticatedRequest, res: Response) {
        try {

            const newLocker = new Locker(req.body);
            const savedLocker = await newLocker.save();
            res.status(201).json(savedLocker);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getLocker(req: Request, res: Response) {
        try {
            const locker = await Locker.findById(req.params.id);
            if (!locker) {
                 res.status(404).json({ error: 'Locker not found' });
                    return;
            }
            res.json(locker);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getAllLockers(req: Request, res: Response) {
        try {
            const lockers = await Locker.find();
            res.json(lockers);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getAvailableLockers(req: Request, res: Response) {
        try {
            const lockers = await Locker.find({ status: LockerStatus.AVAILABLE });
            res.json(lockers);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateLocker(req: Request, res: Response) {
        try {
            const locker = await Locker.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!locker) {
                 res.status(404).json({ error: 'Locker not found' });
                return;
            }
            res.json(locker);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async deleteLocker(req: Request, res: Response) {
        try {
            const locker = await Locker.findByIdAndDelete(req.params.id);
            if (!locker) {
                 res.status(404).json({ error: 'Locker not found' });
                return;
            }
            res.json({ message: 'Locker deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateLockerStatus(req: Request, res: Response) {
        try {
            const { status } = req.body;

            if (!Object.values(LockerStatus).includes(status)) {
                 res.status(400).json({ error: 'Invalid status' });
                return;
            }

            const locker = await Locker.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            );

            if (!locker) {
                 res.status(404).json({ error: 'Locker not found' });
                return;
            }

            res.json(locker);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }


}

export const releaseExpiredLockers = async () => {
    const now = new Date();
    const expiredLockers = await Locker.find({
        status: LockerStatus.RESERVED,
        expiresAt: { $lte: now }
    });

    for (const locker of expiredLockers) {
        locker.status = LockerStatus.AVAILABLE;
        await locker.save();
    }
};
export const lockerController = new LockerController();




