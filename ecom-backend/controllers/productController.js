import {v2 as cloudinary} from 'cloudinary';

import productModel from '../models/productModdel.js';

// Function to add a new product
const addProduct = async (req, res) => {
  try {
    
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // Filter out undefined images
    const images = [image1, image2, image3, image4].filter(item => item !== undefined);

    if (images.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one image is required.' });
    }

    // Upload all valid images to Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: 'image'
        });
        return result.secure_url;
      })
    );

    // Create product data object
    const productData = {
      name,
      description,
      price: Number(price),
      bestseller: bestseller === 'true' || bestseller === true, 
      category,
      subCategory,
      sizes: JSON.parse(sizes), 
      images: imagesUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save product to the database
    const product = new productModel(productData);
    await product.save();

    res.json({
      success: true,
      message: 'Product added successfully',
      productId: product._id
    });

  } catch (error) {
    console.error('Error in addProduct:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong while adding product'
    });
  }
};




//Function for list product

const listProducts = async (req, res) => {

}

// function for removing  product

const removeProduct = async (req, res) => {

}


// function for single product info

const singleProduct = async (req, res) => {

}

export { addProduct, listProducts, removeProduct, singleProduct };