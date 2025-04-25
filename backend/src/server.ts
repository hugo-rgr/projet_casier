import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import userRoutes from './routes/users';

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();
connectDB();


app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('API fonctionnelle');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
