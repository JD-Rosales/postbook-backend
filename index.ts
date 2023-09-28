require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import corsOption from './src/config/cors';
import AuthRoutes from './src/routes/AuthRoutes';
import UserRoutes from './src/routes/UserRoutes';
import ProfileRouter from './src/routes/ProfileRoutes';
import PostRouter from './src/routes/PostRoutes';
import FollowRouter from './src/routes/FollowRoutes';

const PORT: number = parseInt(process.env.PORT as string) || 5000;
const app = express();
const prisma = new PrismaClient();

/* 
To run server on local network, get the ipv4 address 
of your machine and change the LOCAL_IP env value 
*/
const NETWORK_ADDRESS = `${process.env.LOCAL_IP}:${PORT}`;

app.use(cors(corsOption));
app.use(express.json());

if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
  app.listen(PORT, '0.0.0.0', async () => {
    try {
      await prisma.$connect();
      console.log(`Server running on port ${PORT}`);
      console.log(`Server running on ${NETWORK_ADDRESS}`);
    } catch (error) {
      console.log(error);
      await prisma.$disconnect();
      process.exit(1);
    }
  });
} else {
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
}

// api routes
app.all('/api', (req, res) => {
  res.status(200).send('Welcome to Postbook api');
});

// api routes
app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/profile', ProfileRouter);
app.use('/api/post', PostRouter);
app.use('/api/follow', FollowRouter);

app.all('*', (req, res) => {
  res.status(404).send('ROUTE NOT FOUND');
});
