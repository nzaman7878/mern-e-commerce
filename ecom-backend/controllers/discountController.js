import discountModel from '../models/discountModel.js';

// Add new discount
const addDiscount = async (req, res) => {
    try {
        const { name, type, value, targetType, targetIds, startDate, endDate, isActive } = req.body;
        
        const newDiscount = new discountModel({
            name, type, value, targetType, targetIds, startDate, endDate, isActive
        });
        
        await newDiscount.save();
        res.json({ success: true, message: 'Discount added successfully', discount: newDiscount });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update discount
const updateDiscount = async (req, res) => {
    try {
        const { id, name, type, value, targetType, targetIds, startDate, endDate, isActive } = req.body;
        
        const discount = await discountModel.findByIdAndUpdate(id, {
            name, type, value, targetType, targetIds, startDate, endDate, isActive
        }, { new: true });
        
        if (!discount) {
            return res.status(404).json({ success: false, message: 'Discount not found' });
        }
        
        res.json({ success: true, message: 'Discount updated successfully', discount });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete discount
const deleteDiscount = async (req, res) => {
    try {
        const { id } = req.body;
        await discountModel.findByIdAndDelete(id);
        res.json({ success: true, message: 'Discount deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// List all discounts (Admin)
const listDiscounts = async (req, res) => {
    try {
        const discounts = await discountModel.find({});
        res.json({ success: true, discounts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// List active discounts (Public)
const activeDiscounts = async (req, res) => {
    try {
        const currentDate = new Date();
        const discounts = await discountModel.find({
            isActive: true,
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate }
        });
        res.json({ success: true, discounts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addDiscount, updateDiscount, deleteDiscount, listDiscounts, activeDiscounts };
