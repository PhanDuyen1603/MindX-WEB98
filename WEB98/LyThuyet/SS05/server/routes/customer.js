import { Router } from 'express';
import express from 'express';
import { createCustomer } from '../controllers/customers.js';

const router = Router();

router.post('/', createCustomer);

export default router;