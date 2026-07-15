import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js' 
import couponModel from '../models/couponModel.js'
import Stripe from 'stripe'
import razorpay from 'razorpay'
import { calculateOrderTotals } from './checkoutController.js'

// global variables
const currency = 'inr'
const deliveryCharge = 10

// gateway initialize 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Helper to handle coupon usage
const incrementCouponUsage = async (couponApplied) => {
    if (couponApplied) {
        try {
            await couponModel.findByIdAndUpdate(couponApplied._id, { $inc: { usedCount: 1 } });
        } catch (error) {
            console.log("Error incrementing coupon usage:", error);
        }
    }
}

// Placing orders using COD method 
const placeOrder = async (req, res) => {
    try {
        const { userId, items, address, couponCode } = req.body;

        // Securely calculate the actual amount on the backend
        const calculation = await calculateOrderTotals(items, couponCode, userId);
        if (calculation.couponError) {
            return res.status(400).json({ success: false, message: calculation.couponError });
        }

        const finalAmount = calculation.finalTotal + deliveryCharge;

        const orderData = {
            userId,
            items: calculation.finalItems, // Save the items with their discounted prices
            amount: finalAmount, 
            address,
            status: 'Order Placed', 
            paymentMethod: 'COD',
            payment: false,
            date: Date.now()
        }
        
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await incrementCouponUsage(calculation.couponApplied);

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.json({
            success: true,
            message: "Order Placed"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Placing orders using Stripe method 
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address, couponCode } = req.body;
        const { origin } = req.headers;

        const calculation = await calculateOrderTotals(items, couponCode, userId);
        if (calculation.couponError) {
            return res.status(400).json({ success: false, message: calculation.couponError });
        }

        const finalAmount = calculation.finalTotal + deliveryCharge;

        const orderData = {
            userId,
            items: calculation.finalItems,
            amount: finalAmount, 
            address,
            status: 'Order Placed', 
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()
        
        // Prepare Stripe line items using the securely discounted unit prices
        const line_items = calculation.finalItems.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }))

        // If a coupon was applied, we add it as a negative discount line item or just distribute the discount.
        // Stripe doesn't allow negative line items easily. 
        // A better approach is to create a Stripe Coupon on the fly, but for simplicity, 
        // if couponDiscount > 0, we can add a 'Coupon Applied' line item... wait, Stripe requires amount > 0.
        // To fix this without Stripe Coupons, we can apply the coupon proportionally to items or use Stripe discounts array.
        // For production-readiness, we'll use `discounts` if we want, or adjust `unit_amount` proportionally.
        // Let's adjust `unit_amount` proportionally to avoid complex Stripe Coupon syncs.
        
        if (calculation.couponDiscount > 0) {
            const discountRatio = calculation.finalTotal / calculation.subtotal;
            line_items.forEach(li => {
                li.price_data.unit_amount = Math.round(li.price_data.unit_amount * discountRatio);
            });
        }

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        await incrementCouponUsage(calculation.couponApplied);

        res.json({success: true, session_url: session.url});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Placing orders using Razorpay method 
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, address, couponCode } = req.body;

        const calculation = await calculateOrderTotals(items, couponCode, userId);
        if (calculation.couponError) {
            return res.status(400).json({ success: false, message: calculation.couponError });
        }

        const finalAmount = calculation.finalTotal + deliveryCharge;

        const orderData = {
            userId,
            items: calculation.finalItems,
            amount: finalAmount, 
            address,
            status: 'Order Placed', 
            paymentMethod: 'Razorpay',
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await incrementCouponUsage(calculation.couponApplied);

        res.json({
            success: true,
            message: "Razorpay integration pending"
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// All orders data for Admin Panel 
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success: true, orders})
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// User order Data for Frontend
const userOrders = async (req, res) => {
    try {
        const {userId} = req.body

        const orders = await orderModel.find({userId})
        res.json({success: true, orders})
        
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// update order Status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const {orderId, status} = req.body
        
        const updateData = {status}
        if (status === 'Delivered') {
            updateData.payment = true
        }
        
        await orderModel.findByIdAndUpdate(orderId, updateData)
        res.json({success: true, message: 'Status Updated'})
        
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Verify Stripe payment
const verifyStripe = async (req, res) => {
    try {
        const {orderId, success} = req.body;

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment: true});
            await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}});
            res.json({success: true, message: "Payment Successful"});
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success: false, message: "Payment Failed"});
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

export { verifyStripe, placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus }
