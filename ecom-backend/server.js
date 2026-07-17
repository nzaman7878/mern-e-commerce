import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongoDB.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import adminRouter from './routes/adminRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import discountRouter from './routes/discountRoute.js';
import couponRouter from './routes/couponRoute.js';

// Security Middlewares
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Rate limiting (limit each IP to 500 requests per 15 mins)
const limiter = rateLimit({
    max: 500,
    windowMs: 15 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', limiter);



// API endpoints

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/cart', cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/admin', adminRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/discounts', discountRouter)
app.use('/api/coupons', couponRouter)
app.get('/', (req, res) => {
    res.send('API Working');
});

// Start server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
