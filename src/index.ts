require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import corsOption from './config/cors';
import UserRouter from './routes/UserRoutes';
import ProfileRouter from './routes/ProfileRoutes';
import PostRouter from './routes/PostRoutes';
import FollowsRouter from './routes/FollowsRoutes';

const PORT: number = parseInt(process.env.PORT as string) || 5000;
const app = express();
const prisma = new PrismaClient();

app.use(cors(corsOption));
app.use(express.json());

// api routes
app.use('/api/user', UserRouter);
app.use('/api/profile', ProfileRouter);
app.use('/api/post', PostRouter);
app.use('/api/follow', FollowsRouter);

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
