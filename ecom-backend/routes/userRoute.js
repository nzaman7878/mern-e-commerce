import express from 'express';
import userController from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';

const userRouter = express.Router();

userRouter.post('/login', userController.loginUser);
userRouter.post('/register', userController.registerUser);
userRouter.post('/admin', userController.adminLogin);

// Profile routes
userRouter.post('/profile/get', authUser, userController.getUserProfile);
userRouter.post('/profile/update', authUser, userController.updateUserProfile);

export default userRouter;
