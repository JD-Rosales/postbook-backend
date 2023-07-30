require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import corsOption from './config/cors';
import UserRouter from './routes/UserRoutes';
import PostRouter from './routes/PostRoutes';

const PORT: number = parseInt(process.env.PORT as string) || 5000;
const app = express();
const prisma = new PrismaClient();

app.use(cors(corsOption));
app.use(express.json());

// api routes
app.use('/api/user', UserRouter);
app.use('/api/post', PostRouter);

app.all('*', (req, res) => {
  res.send('POST BOOK BACKEND API');
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
