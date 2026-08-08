import express from 'express';

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Customer from './model/Customer.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import customerRoutes from './routes/customer.js';
import authMiddleware from './middlewares/auth.js';
import User from './model/User.js';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = Number(process.env.PORT) || 8080;
const SALT_ROUNDS = 10;

const JSON_SERVER = 'http://localhost:3000';
const app = express();
app.use(express.json());

// Public routes — không cần auth
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'username, email and password are required' });
        }

        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            return res.status(400).json({ message: 'Email or username already exists' });
        }

        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hash = await bcrypt.hash(password, salt);
        const user = await User.create({ username, email, salt, hash });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                type: user.type,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'email and password are required' });
        }

        const currentUser = await User.findOne({ email });
        if (!currentUser) {
            return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
        }

        const hashingPasswordLogin = bcrypt.hashSync(password, currentUser.salt);
        if (hashingPasswordLogin !== currentUser.hash) {
            return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
        }

        res.status(200).json({
            message: 'Login successfully!',
            user: {
                id: currentUser._id,
                username: currentUser.username,
                email: currentUser.email,
                hash: currentUser.hash,
                salt: currentUser.salt,
                type: currentUser.type,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});

app.use(authMiddleware.authentication);
app.use(authMiddleware.authorizationAdmin);

app.get('/customers', async (req, res) => {
    try {
        const list = await Customer.find({}).lean();
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});

// Kiểm tra quyền truy cập API
app.get('/admin', authMiddleware.authorizationAdmin, (req, res) => {
    res.send('Admin panel');
});

app.get('/customers/:id', async (req, res) => {
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
});

app.use('/customers', customerRoutes);

// app.post('/customers', async (req, res) => {
//     try {
//         const { name, email, age } = req.body;

//         if (!name || !email || !age) {
//             return res.status(400).json({ message: 'Name, email and age are required' });
//         }

//         const existing = await Customer.findOne({ email: email }).lean();
//         if (existing) {
//             return res.status(400).json({ message: 'Email already exists' });
//         }

//         const id = crypto.randomUUID();
//         const customer = await Customer.create({ id, name, email, age });
//         res.status(201).json(customer);
//     } catch (error) {
//         res.status(500).json({ message: error.message || 'Internal server error' });
//     }
// });


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