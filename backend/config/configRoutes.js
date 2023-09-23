import express from 'express';
import { getPayPalClientId } from './configController.js';

const router = express.Router();
router.route('/paypal').get(getPayPalClientId);

export default router;
