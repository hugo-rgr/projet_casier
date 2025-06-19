
import { Router } from 'express';
import { lockerController } from '../controllers/locker.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { roleMiddleware } from "../middlewares/role.middleware";
import { UserRole } from "../types";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Lockers
 *   description: Locker management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Locker:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         number:
 *           type: integer
 *         size:
 *           type: string
 *           enum: [small, medium, large]
 *         status:
 *           type: string
 *           enum: [available, reserved, maintenance]
 *         price:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v0/lockers:
 *   get:
 *     summary: Retrieve all lockers
 *     tags: [Lockers]
 *     responses:
 *       200:
 *         description: A list of lockers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Locker'
 */
router.get('/', lockerController.getAllLockers);

/**
 * @swagger
 * /api/v0/lockers/available:
 *   get:
 *     summary: Retrieve available lockers
 *     tags: [Lockers]
 *     responses:
 *       200:
 *         description: A list of available lockers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Locker'
 */
router.get('/available', lockerController.getAvailableLockers);

/**
 * @swagger
 * /api/v0/lockers/{id}:
 *   get:
 *     summary: Get locker by ID
 *     tags: [Lockers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Locker details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Locker'
 *       404:
 *         description: Locker not found
 */
router.get('/:id', lockerController.getLocker);

/**
 * @swagger
 * /api/v0/lockers:
 *   post:
 *     summary: Create a new locker (admin only)
 *     tags: [Lockers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [number, size, price]
 *             properties:
 *               number:
 *                 type: integer
 *               size:
 *                 type: string
 *                 enum: [small, medium, large]
 *               status:
 *                 type: string
 *                 enum: [available, reserved, maintenance]
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Locker created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Locker'
 *       400:
 *         description: Validation error
 */
router.post('/', verifyToken, roleMiddleware([UserRole.ADMIN]), lockerController.createLocker);

/**
 * @swagger
 * /api/v0/lockers/{id}:
 *   put:
 *     summary: Update locker (admin only)
 *     tags: [Lockers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Locker'
 *     responses:
 *       200:
 *         description: Locker updated
 *       404:
 *         description: Locker not found
 */
router.put('/:id', verifyToken, roleMiddleware([UserRole.ADMIN]), lockerController.updateLocker);

/**
 * @swagger
 * /api/v0/lockers/{id}:
 *   delete:
 *     summary: Delete locker (admin only)
 *     tags: [Lockers]
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
 *         description: Locker deleted
 *       404:
 *         description: Locker not found
 */
router.delete('/:id', verifyToken, roleMiddleware([UserRole.ADMIN]), lockerController.deleteLocker);

/**
 * @swagger
 * /api/v0/lockers/{id}/status:
 *   put:
 *     summary: Update locker status (admin only)
 *     tags: [Lockers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, reserved, maintenance]
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Locker not found
 */
router.put('/:id/status', verifyToken, roleMiddleware([UserRole.ADMIN]), lockerController.updateLockerStatus);

export default router;
