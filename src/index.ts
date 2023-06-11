require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
// import { authorRouter } from './author/author.router';
import { UserRouter } from './routes/UserRoutes';

const PORT: number = parseInt(process.env.PORT as string) || 8000;
const app = express();
const prisma = new PrismaClient();

app.use(cors());
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', UserRouter);

// app.use('/api/authors', authorRouter);

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
