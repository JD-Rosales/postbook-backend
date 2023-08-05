import express from 'express';
import * as AuthController from '../controllers/AuthController';
import verifyJwt from '../middlewares/VerifyToken';

const AuthRouter = express.Router();

AuthRouter.get('/', verifyJwt, AuthController.validateToken);
AuthRouter.post('/register', AuthController.register);
AuthRouter.post('/login', AuthController.login);

export default AuthRouter;
