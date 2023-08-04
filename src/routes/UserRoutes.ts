import express from 'express';
import * as UserController from '../controllers/UserController';
import verifyJwt from '../middlewares/VerifyToken';

const UserRouter = express.Router();

UserRouter.get('/', verifyJwt, UserController.validateToken);
UserRouter.post('/register', UserController.register);
UserRouter.post('/login', UserController.login);

export default UserRouter;
