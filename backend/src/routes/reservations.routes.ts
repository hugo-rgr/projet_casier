
import { Router } from 'express';
import reservationController from '../controllers/reservation.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { UserRole } from '../types';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Locker reservation management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *           description: User ID
 *         locker:
 *           type: string
 *           description: Locker ID
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: integer
 *         totalPrice:
 *           type: number
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed, expired]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v0/reservations:
 *   post:
 *     summary: Create a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lockerId, duration]
 *             properties:
 *               lockerId:
 *                 type: string
 *               duration:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reservation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */
router.post('/', verifyToken, reservationController.createReservation);

/**
 * @swagger
 * /api/v0/reservations/user:
 *   get:
 *     summary: Get current user's reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get('/user', verifyToken, reservationController.getUserReservations);

/**
 * @swagger
 * /api/v0/reservations/{id}:
 *   delete:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation cancelled
 */
router.delete('/:id', verifyToken, reservationController.cancelReservation);

/**
 * @swagger
 * /api/v0/reservations:
 *   get:
 *     summary: Get all reservations (admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get('/', verifyToken, roleMiddleware([UserRole.ADMIN]), reservationController.getAllReservations);

/**
 * @swagger
 * /api/v0/reservations/{id}:
 *   get:
 *     summary: Get a reservation by ID (admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */
router.get('/:id', verifyToken, roleMiddleware([UserRole.ADMIN]), reservationController.getReservation);

/**
 * @swagger
 * /api/v0/reservations/process-expired:
 *   post:
 *     summary: Process expired reservations (admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expired reservations processed
 */
router.post('/process-expired', verifyToken, roleMiddleware([UserRole.ADMIN]), reservationController.processExpiredReservations);

/**
 * @swagger
 * /api/v0/reservations/send-reminders:
 *   post:
 *     summary: Send reservation reminder emails (admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reminders sent
 */
router.post('/send-reminders', verifyToken, roleMiddleware([UserRole.ADMIN]), reservationController.sendReminders);

export default router;
