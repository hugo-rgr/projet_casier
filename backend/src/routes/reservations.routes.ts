import {Router} from 'express';
import reservationController from '../controllers/reservation.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import {roleMiddleware} from "../middlewares/role.middleware";
import {UserRole} from "../types";

const router = Router();

// User routes
router.post('/', verifyToken, reservationController.createReservation);
router.get('/user', verifyToken, reservationController.getUserReservations);
router.delete('/:id', verifyToken, reservationController.cancelReservation);

// Admin routes
router.get('/', verifyToken,roleMiddleware([UserRole.ADMIN]), reservationController.getAllReservations);
router.get('/:id', verifyToken,roleMiddleware([UserRole.ADMIN]), reservationController.getReservation);
router.post('/process-expired', verifyToken,roleMiddleware([UserRole.ADMIN]), reservationController.processExpiredReservations);
router.post('/send-reminders', verifyToken,roleMiddleware([UserRole.ADMIN]), reservationController.sendReminders);

export default router;
