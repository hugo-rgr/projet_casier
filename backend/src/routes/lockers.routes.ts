import {Router} from 'express';
import {lockerController}  from '../controllers/locker.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import {roleMiddleware} from "../middlewares/role.middleware";
import {UserRole} from "../types";

const router = Router();



// Public routes
router.get('/', lockerController.getAllLockers);
router.get('/available', lockerController.getAvailableLockers);
router.get('/:id', lockerController.getLocker);


// Admin routes
router.post('/', verifyToken, roleMiddleware([UserRole.ADMIN]), lockerController.createLocker);
router.put('/:id', verifyToken, roleMiddleware([UserRole.ADMIN]),lockerController.updateLocker);
router.delete('/:id', verifyToken, roleMiddleware([UserRole.ADMIN]),lockerController.deleteLocker);
router.put('/:id/status', verifyToken, roleMiddleware([UserRole.ADMIN]),lockerController.updateLockerStatus);

export default router;
