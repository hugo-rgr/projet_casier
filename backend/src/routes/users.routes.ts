import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import {roleMiddleware} from "../middlewares/role.middleware";
import {UserRole} from "../types";
import {userController} from "../controllers/users.controller";

const router = Router();


// Public routes
router.get('/:id', verifyToken, userController.getUser);

// Admin routes
router.get('/', verifyToken, roleMiddleware([UserRole.ADMIN]), userController.getAllUsers);
router.post('/', verifyToken, roleMiddleware([UserRole.ADMIN]), userController.createUser);
router.put('/:id', verifyToken, roleMiddleware([UserRole.ADMIN]),userController.updateUser);
router.delete('/:id', verifyToken, roleMiddleware([UserRole.ADMIN]),userController.deleteUser);


export default router;
