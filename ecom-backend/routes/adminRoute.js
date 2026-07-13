import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const adminRouter = express.Router();

adminRouter.get('/dashboard', adminAuth, getDashboardStats);

export default adminRouter;
