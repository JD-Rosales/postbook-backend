const express = require('express');
const router = express.Router();

import * as UserController from '../controllers/UserController';

export const UserRouter = express.Router();

UserRouter.get('/:id', UserController.getUser);
UserRouter.post('/register', UserController.register);
