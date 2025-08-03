

// add products to user cart 


import userModel from "../models/userModel"

const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body

    
    const userData = await userModel.findById(userId)
    let cartData = userData.cartData || {};

   
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    
    if (cartData[itemId][size]) {
      cartData[itemId][size] += 1;
    } else {
      cartData[itemId][size] = 1;
    }

    // Save updated cartData
    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: "Added To Cart"
    });

  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message 
    });
  }
}


// update user cart 

const updateCart = async (req, res) =>{
    
}

// get  user cart data

const getUserCart = async (req, res) =>{
    
}

export{addToCart, updateCart, getUserCart}