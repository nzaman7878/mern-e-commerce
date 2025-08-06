
import orderModel from '../models/orderModel.js'
//Placing orders using COD method 

const placeOrder = async (req, res) =>  {
try {
    const {userId, items, amount, address} = req.body;

    const orderData = {
        userId,
        items,
        address,
        paymentMethod:'COD',
        payment:false,
        date: Date.now()
    }
    const newOrder = new orderModel(orderData)
    await  newOrder.save()

    await userModel.findByIdAndUpdate(userId, {cartData:{}})

    res.json({
        success:true,
        message:"Order Placed"
    })
} catch (error) {
    console.log(error)
    res.json({
        success:false,
        message:error.message
    })
    
}

}



//Placing orders using Stripe method 

const placeOrderStripe = async (req, res) =>  {


}


//Placing orders using Razorpay  method 

const placeOrderRazorpay  = async (req, res) =>  {


}

//All orders data for Admin Panel 

const allOrders = async (req, res) =>  {


}

// User order Data for Frontend

const userOrders = async (req, res) =>{

}


// update order Status

const updateStatus = async (req, res) => {

}

export {placeOrder , placeOrderStripe, placeOrderRazorpay, allOrders, userOrders , updateStatus}