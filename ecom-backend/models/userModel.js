import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: [50, 'Email cannot exceed 50 characters'],
        validate: {
            validator: function (v) {
                return validator.isEmail(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: [100, 'Password cannot exceed 100 characters'],
        select: false
    },
    cartData: {
        type: Object,
        default: {}
    }
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
