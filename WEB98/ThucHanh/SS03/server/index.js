import express from 'express';
import crypto from 'crypto';
import { customers } from './data.js';

const PORT = 8080;
const JSON_SERVER = 'http://localhost:3000';
const app = express();
app.use(express.json());
app.get('/customers', (req, res) => {
    res.json(customers);
});

app.get('/customers/:id', (req, res) => {
    const id = req.params.id; //Cách lấy id từ params c001
    const customer = customers.find(customer => customer.id == id);

    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
});

app.post('/customers', (req, res) => {
    const { name, email, age } = req.body || {};

    if(!name || !email || !age) {
        return res.status(400).json({ message: 'Name, email and age are required' });
    }

   const isEmailUsed = customers.some(customer => customer.email === email);
   if(isEmailUsed) {
    return res.status(400).json({ message: 'Email already used' });
   }

   let id = crypto.randomUUID();
   while (customers.some(customer => customer.id == id)) {
    id = crypto.randomUUID();
   }

   const newCustomer = {
    id,
    name,
    email,
    age
   };

   customers.push(newCustomer);
   res.status(201).json(newCustomer);
});

app.get("/customers/:customerId/orders", async (req, res) => {
    const { customerId } = req.params;

    try {
        const response = await fetch(`${JSON_SERVER}/orders?customerId=${customerId}`);
        if (!response.ok) {
            return res.status(response.status).json({ message: 'Failed to fetch orders' });
        }
        const orders = await response.json();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});