import {NextFunction, Response} from "express";
import {AuthenticatedRequest} from "./auth.middleware";
import {UserRole} from "../types";

export const roleMiddleware = (roles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user?.role)) {
            res.status(403).json({ message: 'Accès non autorisé' });
            return;
        }
        next();
    };
};
