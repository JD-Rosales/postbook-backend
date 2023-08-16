require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import ErrorHandler from './middlewares/ErrorHandler';
import corsOption from './config/cors';
import AuthRoutes from './routes/AuthRoutes';
import ProfileRouter from './routes/ProfileRoutes';
import PostRouter from './routes/PostRoutes';
import FollowRouter from './routes/FollowRoutes';

const PORT: number = parseInt(process.env.PORT as string) || 5000;
const app = express();
const prisma = new PrismaClient();

app.use(cors(corsOption));
app.use(express.json());

// api routes
app.use('/api/user', AuthRoutes);
app.use('/api/profile', ProfileRouter);
app.use('/api/post', PostRouter);
app.use('/api/follow', FollowRouter);

app.all('*', (req, res) => {
  res.status(404).send('ROUTE NOT FOUND');
});

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
});
