import express from 'express';
import * as PostController from '../controllers/PostController';
import verifyJwt from '../middlewares/VerifyToken';

const PostRouter = express.Router();

PostRouter.get('/followed', verifyJwt, PostController.fetchFollowed);
PostRouter.get('/user/:id', verifyJwt, PostController.fetchUserPosts);
PostRouter.get('/:id', verifyJwt, PostController.getPost);
PostRouter.get('/likes/:id', verifyJwt, PostController.getTotalLikes);
PostRouter.post('/like_post', verifyJwt, PostController.likePost);
PostRouter.post('/share', verifyJwt, PostController.sharePost);
PostRouter.post('/', verifyJwt, PostController.createPost);
PostRouter.put('/', verifyJwt, PostController.updatePost);
PostRouter.delete('/:id', verifyJwt, PostController.deletePost);

export default PostRouter;
