import express from 'express';
import * as PostController from '../controllers/PostController';
import verifyJwt from '../middlewares/VerifyToken';

const PostRouter = express.Router();

PostRouter.post('/share', verifyJwt, PostController.sharePost);
PostRouter.post('/', verifyJwt, PostController.createPost);
PostRouter.get('/:id', verifyJwt, PostController.fetchUserPosts);
PostRouter.get('/', verifyJwt, PostController.fetchFollowed);

export default PostRouter;
