import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Function to create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  
};

// Route for user registration
const registerUser = async (req, res) => {
  
};

// Route for admin Login
const adminLogin = async (req, res) => {
  
};

export default { loginUser, registerUser, adminLogin };
