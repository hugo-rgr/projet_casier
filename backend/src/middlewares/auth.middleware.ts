import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'; //TODO: exception if null
const JWT_EXPIRES_IN = '24h'; //TODO: change to process.env.JWT_EXPIRES_IN || '1h'

export interface AuthenticatedRequest extends Request {
    user?: any;
}

// Generate JWT token
export const generateToken = (userId: string, role: string) => {
    return jwt.sign(
        {
            userId,
            role
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN
        }
    );
};

// Verify JWT token middleware
//export const authenticateToken = async (req: any, res: Response, next: NextFunction) => {
//    try {
//        // Get token from Authorization header
//        const authHeader = req.headers.authorization;
//        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
//
//        if (!token) {
//            return res.status(401).json({
//                error: 'Access denied. No token provided.'
//            });
//        }
//
//        // Verify token
//        const decoded = jwt.verify(token, JWT_SECRET) as any;
//
//        // Get user from database
//        const user = await User.findById(decoded.userId).select('-password');
//        if (!user) {
//            return res.status(401).json({
//                error: 'Invalid token. User not found.'
//            });
//        }
//
//        // Add user to request object
//        req.user = user;
//        next();
//
//    } catch (error: any) {
//        if (error.name === 'JsonWebTokenError') {
//            return res.status(401).json({ error: 'Invalid token.' });
//        }
//        if (error.name === 'TokenExpiredError') {
//            return res.status(401).json({ error: 'Token expired.' });
//        }
//        res.status(500).json({ error: 'Server error during authentication.' });
//    }
//};
//
//export const requireAdmin = (req: any, res: Response, next: NextFunction) => {
//    if (!req.user) {
//        return res.status(401).json({ error: 'Authentication required' });
//    }
//
//    if (req.user.role !== 'admin') {
//        return res.status(403).json({
//            error: 'Access denied'
//        });
//    }
//
//    next();
//};

// User authorization middleware - users can only access their own data
//export const requireOwnershipOrAdmin = (req: any, res: Response, next: NextFunction) => {
//    if (!req.user) {
//        return res.status(401).json({ error: 'Authentication required.' });
//    }
//
//    const requestedUserId = req.params.id;
//    const currentUserId = req.user._id.toString();
//    const isAdmin = req.user.role === 'admin';
//
//    // Allow if admin or accessing own data
//    if (isAdmin || currentUserId === requestedUserId) {
//        return next();
//    }
//
//    return res.status(403).json({
//        error: 'Access denied. You can only access your own data.'
//    });
//};

export const verifyToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const token = req.headers['authorization'];

    if (!token) {
        res.status(403).send('Token manquant.');
        return;
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
            res.status(500).send("Échec de l'authentification");
            return;
        }

        req.user = decoded;
        next();
    });
};


