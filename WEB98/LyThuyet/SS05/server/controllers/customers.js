import Customer from '../model/Customer.js';
import crypto from 'crypto';


export const createCustomer = async (req, res) => {
    try {
        const { name, email, age } = req.body;

        if (!name || !email || !age) {
            return res.status(400).json({ message: 'Name, email and age are required' });
        }

        const existing = await Customer.findOne({ email: email }).lean();
        if (existing) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const id = crypto.randomUUID();
        const customer = await Customer.create({ id, name, email, age });
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};