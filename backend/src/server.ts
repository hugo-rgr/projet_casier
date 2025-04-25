import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

dotenv.config();
connectDB();

app.get('/', (req: Request, res: Response) => {
    res.send('API fonctionnelle');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
