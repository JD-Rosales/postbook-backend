const express = require('express');
const router = express.Router();

import * as UserController from '../controllers/UserController';

const UserRouter = express.Router();

UserRouter.post('/register', UserController.register);
UserRouter.get('/:id', UserController.getUser);

export default UserRouter;
