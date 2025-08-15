import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js' 
import Stripe from 'stripe'

// global variables
const currency = 'inr'
const deliveryCharge = 10

// gateway initialize 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY) // Fixed: STRIPE_SERECT_KEY -> STRIPE_SECRET_KEY

//Placing orders using COD method 
const placeOrder = async (req, res) => {
    try {
        const {userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            amount, 
            address,
            status: 'Order Placed', 
            paymentMethod: 'COD',
            payment: false,
            date: Date.now()
        }
        
        const newOrder = new orderModel(orderData)
        await newOrder.save()

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

//Placing orders using Stripe method 
const placeOrderStripe = async (req, res) => {
    try {
        const {userId, items, amount, address} = req.body;
        const {origin} = req.headers;

        const orderData = {
            userId,
            items,
            amount, 
            address,
            status: 'Order Placed', 
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()
        
        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100 // Fixed: delivery -> deliveryCharge
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success: true, session_url: session.url});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

//Placing orders using Razorpay method 
const placeOrderRazorpay = async (req, res) => {
    try {
        const {userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            amount, 
            address,
            status: 'Order Placed', 
            paymentMethod: 'Razorpay',
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        // Add Razorpay implementation here
        // const razorpay = new Razorpay({
        //     key_id: process.env.RAZORPAY_KEY_ID,
        //     key_secret: process.env.RAZORPAY_KEY_SECRET
        // })

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

//All orders data for Admin Panel 
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
        
        await orderModel.findByIdAndUpdate(orderId, {status})
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

export { verifyStripe, placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus}
