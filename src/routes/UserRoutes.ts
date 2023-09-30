import express from 'express';
import * as UserController from '../controllers/UserController';
import verifyJwt from '../middlewares/VerifyToken';

const UserRouter = express.Router();

UserRouter.get('/:id', verifyJwt, UserController.getUserProfile);
UserRouter.put('/', verifyJwt, UserController.updateProfile);
UserRouter.put('/profile-photo', verifyJwt, UserController.updateProfilePhoto);
UserRouter.put('/cover-photo', verifyJwt, UserController.updateCoverPhoto);
UserRouter.get('/search', verifyJwt, UserController.searchUser);

export default UserRouter;
