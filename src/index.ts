require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import UserRouter from './routes/UserRoutes';

const PORT: number = parseInt(process.env.PORT as string) || 5000;
const app = express();
const prisma = new PrismaClient();

const whitelist = [
  'https://friendly-croissant-e5dcc5.netlify.app',
  'https://www.google.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin as string) !== -1) {
        callback(null, true);
        console.log(origin, 'is allowed by CORS');
      } else {
        console.log(origin, 'is block by CORS');
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
