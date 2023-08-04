import express from 'express';
import * as FollowsController from '../controllers/FollowsController';
import verifyJwt from '../middlewares/VerifyToken';

const FollowsRouters = express.Router();

FollowsRouters.post('/', verifyJwt, FollowsController.followUser);
FollowsRouters.delete('/', verifyJwt, FollowsController.unfollowUser);

export default FollowsRouters;
