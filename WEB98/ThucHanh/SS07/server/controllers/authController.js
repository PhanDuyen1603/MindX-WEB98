import crypto from 'crypto';
import bcrypt from 'bcrypt';
import Customer from '../model/Customer.js';

export const register = async (req, res) => {

    const { username, email, age, password } = req.body;

    const existing = await Customer.findOne({ email });
    if(existing) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hasshedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({ username, email, age, password: hasshedPassword });
    const result = customer.toObject();
    delete result.password;
    res.status(201).json({ message: 'Customer registered successfully', customer: result });

}