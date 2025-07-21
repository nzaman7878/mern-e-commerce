import express from 'express';
import userController from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/login', userController.loginUser);
userRouter.post('/register', userController.registerUser);
userRouter.post('/admin', userController.adminLogin);

export default userRouter;
