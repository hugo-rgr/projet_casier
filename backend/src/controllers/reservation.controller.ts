import { Request, Response } from 'express';
import Reservation from '../models/Reservation.model';
import User from '../models/User.model';
import { Document } from 'mongoose';
import Locker from '../models/Locker.model';
import {AuthenticatedRequest} from "../middlewares/auth.middleware";
import {LockerStatus} from "../types";
import {
    sendLockerReservationExpirationReminderEmail,
    sendLockerReservationExpiredEmail,
    sendLockerReservationSuccessEmail
} from "../mailtrap/email";
import cron, { ScheduledTask } from 'node-cron';

class ReservationController {
    private cleanupCronJob?: ScheduledTask;

    constructor() {
        this.initCronJobs();
    }

    private initCronJobs(): void {
        // 1. Nettoyage des utilisateurs inactifs (tous les jours à 2h)
        this.cleanupCronJob = cron.schedule('0 2 * * *', async () => {
            await this.processExpiredReservations();
        });
    }
    async createReservation(req: AuthenticatedRequest, res: Response) {
        try {
            const { lockerId, duration } = req.body;
            const userId = req.user.userId;

            const locker = await Locker.findById(lockerId);
            if (!locker) {
                 res.status(404).json({ error: 'Locker not found' });
                 return;
            }

            if (locker.status !== LockerStatus.AVAILABLE) {
                 res.status(400).json({ error: 'Locker is not available' });
            }

            const startDate = new Date();
            const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
            const totalPrice = locker.price * duration;


            const toRegisterReservation = await Reservation.create({
                user: userId,
                locker: locker._id,
                startDate,
                endDate,
                duration,
                totalPrice,
                paymentStatus: 'paid',
            });

            const reservation = await Reservation.findById(
                toRegisterReservation.id
            ).populate('user').populate('locker') as unknown as ReservationDocument;

            locker.status = LockerStatus.RESERVED;
            await locker.save();

            await sendLockerReservationSuccessEmail(
                reservation.user.email,
                reservation.user.firstname,
                reservation.locker.number,
                reservation.startDate.toLocaleString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                reservation.endDate.toLocaleString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
            );

            res.status(201).json(toRegisterReservation);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getReservation(req: Request, res: Response) {
        try {
            const reservation = await Reservation.findById(req.params.id)
                .populate('locker')
                .populate('user');
            if (!reservation) {
                 res.status(404).json({ error: 'Reservation not found' });
                 return;
            }
            res.json(reservation);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getUserReservations(req: AuthenticatedRequest, res: Response) {
        try {
            const reservations = await Reservation.find({ user: req.user.userId })
                .populate('locker');
            res.json(reservations);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getAllReservations(req: Request, res: Response) {
        try {
            const reservations = await Reservation.find()
                .populate('user')
                .populate('locker');
            res.json(reservations);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async cancelReservation(req: Request, res: Response) {
        try {
            const reservation = await Reservation.findById(req.params.id);
            if (!reservation) {
                 res.status(404).json({ error: 'Reservation not found' });
                return;
            }

            const locker = await Locker.findById(reservation.locker);
            if (locker) {
                locker.status = LockerStatus.AVAILABLE;
                await locker.save();
            }

            await reservation.deleteOne();

            res.json({ message: 'Reservation cancelled successfully' });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async processExpiredReservations() {
        try {
            const now = new Date();
            const expiredReservations = await Reservation.find({ endDate: { $lt: now } }).populate('user').populate('locker') as unknown as ReservationDocument[];

            let count = 0;
            for (const reservation of expiredReservations) {
                const locker = await Locker.findById(reservation.locker);
                if (locker) {
                    locker.status = LockerStatus.AVAILABLE;
                    await locker.save();
                }
                await sendLockerReservationExpiredEmail(reservation.user.email, reservation.user.firstname, reservation.locker.number);
                await reservation.deleteOne();
                count++;
            }

            console.log({ message: `Processed ${count} expired reservations` });
        } catch (error) {
            console.log({ error: (error as Error).message });
        }
    }

    async sendReminders(req: AuthenticatedRequest, res: Response) {
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            const reservations = await Reservation.find({
                endDate: {
                    $gte: new Date(),
                    $lt: tomorrow
                }
            }).populate('user').populate('locker') as unknown as ReservationDocument[];

            let count = 0;
            for (const reservation of reservations) {
                if (reservation.user?.email && reservation.locker?.number) {
                     await sendLockerReservationExpirationReminderEmail
                     (reservation.user.email, reservation.user.firstname, reservation.locker.number,  reservation.endDate.toLocaleString('fr-FR', {
                         weekday: 'long',
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric',
                         hour: '2-digit',
                         minute: '2-digit'
                     }) );
                    count++;
                }
            }

            res.json({ message: `Sent ${count} reminder emails` });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}

interface PopulateUser {
        email: string;
        firstname: string;
}
interface PopulateLocker {
        number: string;
        price: number;
}
interface ReservationDocument extends Document {
    user: PopulateUser;
    locker: PopulateLocker;
    startDate: Date;
    endDate: Date;
    duration: number;
    totalPrice: number;
    paymentStatus: string;
    paymentId?: string;
    emailSent?: boolean;
    reminderSent?: boolean;
}


export default new ReservationController();
