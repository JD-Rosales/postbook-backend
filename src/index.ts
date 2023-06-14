require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import UserRouter from './routes/UserRoutes';

const PORT: number = parseInt(process.env.PORT as string) || 5000;
const app = express();
const prisma = new PrismaClient();

// app.use(
//   cors({
//     origin: ['friendly-croissant-e5dcc5.netlify.app'],
//     credentials: true,
//   })
// );

const whitelist = ['friendly-croissant-e5dcc5.netlify.app'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin as string) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// api routes
app.use('/api/user', UserRouter);

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
