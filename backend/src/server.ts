import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import userRoutes from './routes/users.routes';
import lockerRoutes from "./routes/lockers.routes";
import reservationRoutes from "./routes/reservations.routes";
import authRoutes from "./routes/auth.routes";
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from "./swagger";

dotenv.config({ path: '../.env' });
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Connexion à la base de données
connectDB();

//Routes
app.use('/api/v0/auth', authRoutes);
app.use('/api/v0/users', userRoutes);
app.use('/api/v0/lockers', lockerRoutes);
app.use('/api/v0/reservations', reservationRoutes);




app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
