import express, { Request, Response } from 'express';
import cors from 'cors';
import reservationRoutes from './routes/reservationRoutes';


const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware
app.use(express.json());
app.use(cors());

