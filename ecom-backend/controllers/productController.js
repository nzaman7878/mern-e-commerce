import {v2 as cloudinary} from 'cloudinary';

import productModel from '../models/productModel.js';

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
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
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
      image: imagesUrl,
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
    console.error('Error in List Product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong while adding product'
    });
  }
};




//Function for list product

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}); 

    res.json({
      success: true,
      message: 'Products fetched successfully',
      products
    });
  } catch (error) {
    console.error('Error in Remove Product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong while list product'
    });
  }
};


// function for removing  product


const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required.',
      });
    }

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error) {
    console.error('Error in removeProduct:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong while removing the product',
    });
  }
};



// function for single product info

const singleProduct = async (req, res) => {
  try {
    const productId = req.body?.productId || req.query?.productId;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product fetched successfully',
      product,
    });
  } catch (error) {
    console.error('Error in singleProduct:', error); 
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching product',
    });
  }
};

// Function to update a product
const updateProduct = async (req, res) => {
  try {
    const { id, name, description, price, category, subCategory, sizes, bestseller } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const image1 = req.files && req.files.image1 && req.files.image1[0];
    const image2 = req.files && req.files.image2 && req.files.image2[0];
    const image3 = req.files && req.files.image3 && req.files.image3[0];
    const image4 = req.files && req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(item => item !== undefined);

    let productData = {
      name,
      description,
      price: Number(price),
      bestseller: bestseller === 'true' || bestseller === true,
      category,
      subCategory,
      sizes: sizes ? JSON.parse(sizes) : [],
      updatedAt: new Date()
    };

    if (images.length > 0) {
      const imagesUrl = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: 'image'
          });
          return result.secure_url;
        })
      );
      productData.image = imagesUrl;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, productData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Error in Update Product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong while updating product'
    });
  }
};


export { addProduct, listProducts, removeProduct, singleProduct, updateProduct };