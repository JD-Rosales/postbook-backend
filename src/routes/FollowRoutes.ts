import express from 'express';
import * as FollowController from '../controllers/FollowController';
import verifyJwt from '../middlewares/VerifyToken';

const FollowRouter = express.Router();

FollowRouter.get('/:id', verifyJwt, FollowController.isFollowing);
FollowRouter.get('/followers/:id', verifyJwt, FollowController.userFollowers);
FollowRouter.post('/', verifyJwt, FollowController.followUser);
FollowRouter.delete('/', verifyJwt, FollowController.unfollowUser);

export default FollowRouter;
