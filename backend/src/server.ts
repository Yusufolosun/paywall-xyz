import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const verifyRoutes = require('./routes/verify');
import analyticsRoutes from './routes/analytics';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/verify', verifyRoutes);
app.use('/api/analytics', analyticsRoutes);

app.listen(PORT);

export default app;
