import express from 'express';
import * as PostController from '../controllers/PostController';
import verifyJwt from '../middlewares/VerifyToken';

const PostRouter = express.Router();

PostRouter.post('/', verifyJwt, PostController.createPost);

export default PostRouter;
