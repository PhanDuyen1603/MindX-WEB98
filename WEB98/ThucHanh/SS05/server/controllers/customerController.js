import Customer from '../model/Customer.js';
import Order from '../model/Order.js';

export const getCustomers = async (req, res) => {
    try {
        const list = await Customer.find({}).lean();
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

export const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findOne({ id: id }).lean();
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

export const getOrdersByCustomerId = async (req, res) => {
    try {
        const { customerId } = req.params;
        const orders = await Order.find({ customerId }).lean();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

