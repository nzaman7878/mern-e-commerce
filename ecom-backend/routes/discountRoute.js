import express from 'express';
import { addDiscount, updateDiscount, deleteDiscount, listDiscounts, activeDiscounts } from '../controllers/discountController.js';
import adminAuth from '../middleware/adminAuth.js';

const discountRouter = express.Router();

// Public route for frontend to fetch active discounts
discountRouter.get('/active', activeDiscounts);

// Admin routes
discountRouter.post('/add', adminAuth, addDiscount);
discountRouter.post('/update', adminAuth, updateDiscount);
discountRouter.post('/delete', adminAuth, deleteDiscount);
discountRouter.get('/list', adminAuth, listDiscounts);

export default discountRouter;
