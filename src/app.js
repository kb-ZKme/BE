import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import faceRoutes from './routes/faceRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/face', faceRoutes);

app.use(errorHandler);
export default app;
