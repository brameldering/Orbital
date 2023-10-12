import express from 'express';

import { protect } from '../middleware/authMiddleware';
import {
  getCartForUser,
  saveCartForUser,
  deleteCartForUser,
} from './cartController';

const router = express.Router();
router
  .route('/')
  .get(protect, getCartForUser)
  .post(protect, saveCartForUser)
  .delete(protect, deleteCartForUser);

export default router;
