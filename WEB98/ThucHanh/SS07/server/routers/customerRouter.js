import { Router } from 'express';
import { getCustomers, getCustomerById, getOrdersByCustomerId, createAPIKey, getApikey,  } from '../controllers/customerController.js';

const router = Router();

router.post('/:id/api-key', createAPIKey);
router.use(getApikey);
router.get('/:customerId/orders', getOrdersByCustomerId);
router.get('/', getCustomers);
router.get('/:id', getCustomerById);

export default router;
