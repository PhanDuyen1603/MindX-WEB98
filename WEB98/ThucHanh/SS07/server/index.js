import express from 'express';
import crypto from 'crypto';
import Customer from './model/Customer.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import customerRoutes from './routers/customerRouter.js';
import authRoutes from './routers/authRouter.js';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = Number(process.env.PORT) || 8080;


const JSON_SERVER = 'http://localhost:3000';
const app = express();
app.use(express.json());

app.use('/customers', customerRoutes);
app.use('/register', authRoutes);


app.post('/customers', async (req, res) => {
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
});


async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
}
startServer();