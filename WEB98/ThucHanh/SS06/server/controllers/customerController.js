import Customer from '../model/Customer.js';
import Order from '../model/Order.js';
import { generateApiKey, buildApiKey } from '../utils/apiKey.js';

export const createAPIKey = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findOne({ id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        if (customer.apiKey) {
            return res.json({ apiKey: customer.apiKey });
        }
        const randomString = generateApiKey(12);
        const apiKey = buildApiKey(customer.id, customer.email, randomString);
        customer.apiKey = apiKey;
        await customer.save();
        res.json({ apiKey });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

export const getApikey = async (req, res, next) => {
    try {
        const { apiKey } = req.query;
        if (!apiKey) {
            return res.status(401).json({ message: 'API key is required' });
        }
        const customer = await Customer.findOne({ apiKey }).lean();
        if (!customer) {
            return res.status(401).json({ message: 'Invalid API key' });
        }
        req.customer = customer;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};


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
        const customer = await Customer.findOne({ id }).lean();
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
