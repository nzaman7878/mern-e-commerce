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
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ email }).select('+password'); 
    
    // If no user found
    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      const token = createToken(user._id);
      res.json({
        success: true,
        token,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } else {
      res.json({
        success: false,
        message: "Incorrect password"
      });
    }

  } catch (error) {
    console.log('Login error:', error);
    res.json({
      success: false,
      message: "Server Error"
    });
  }
};


// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({
                success: false,
                message: "user already exists"
            });
        }

        // Validate email address
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        // Validate password length
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        // Create a token and send it back to the user
        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server Error"
        });
    }
};

// Route for admin Login


const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    if (email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      
      const token = jwt.sign(
        email+password,process.env.JWT_SECRET,
               
      );
      res.json({ success: true, token });
      
    
    } else {
      
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};




export default { loginUser, registerUser, adminLogin };
