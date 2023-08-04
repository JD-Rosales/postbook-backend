import express from 'express';
import * as ProfileController from '../controllers/ProfileController';
import verifyJwt from '../middlewares/VerifyToken';

const ProfileRouter = express.Router();

ProfileRouter.get('/:id', verifyJwt, ProfileController.getUserProfile);
ProfileRouter.put('/', verifyJwt, ProfileController.newProfile);

export default ProfileRouter;
