import { Response } from 'express';
import { IExtendedRequest } from 'types/commonTypes';
import { CartDocument } from 'types/mongoose.gen';

import asyncHandler from '../middleware/asyncHandler';

import Cart from './cartModel';

// @desc    Get cart for a suer
// @route   GET /api/carts/v1
// @access  Private
// @req     user._id
// @res     status(200).json(cart)
const getCartForUser = asyncHandler(
  async (req: IExtendedRequest, res: Response) => {
    console.log('getCartForUser, req.user ', req.user);
    if (req.user) {
      const userId = req.user._id;
      const cart = await Cart.find({ userId });
      console.log('getCartForUser, cart ', cart);
      if (cart) {
        return res.status(200).json(cart);
      } else {
        return res.status(200);
      }
    } else {
      return res.status(200);
    }
  }
);

// @desc    Save cart for a user
// @route   POST /api/carts/v1
// @access  Private
// @req     user._id
//          body {cart}
// @res     status(200).message:'Cart saved'
//       or status(400).message:'No cart items'
const saveCartForUser = asyncHandler(
  async (req: IExtendedRequest, res: Response) => {
    const { cartItems, shippingAddress, paymentMethod, totalAmounts } =
      req.body;
    if (cartItems && cartItems.length > 0) {
      if (req.user) {
        const userId = req.user._id;
        //  Delete any carts for this user
        const count = await Cart.countDocuments({ userId });
        if (count > 0) {
          await Cart.deleteMany({ userId });
        }
        // Save new cart for this user
        const newCart = {
          userId,
          cartItems,
          shippingAddress,
          paymentMethod,
          totalAmounts,
        };
        const cartdocument: CartDocument = new Cart(newCart);
        await cartdocument.save();
      }
    }
    res.status(201).json({ message: 'Cart saved' });
  }
);

// @desc    Delete a cart
// @route   DELETE /api/cart/v1
// @access  Private
// @req     user._id
// @res     status(200).json({ message: 'Cart removed' })
const deleteCartForUser = asyncHandler(
  async (req: IExtendedRequest, res: Response) => {
    if (req.user) {
      const userId = req.user._id;
      //  Delete any carts for this user
      const count = await Cart.countDocuments({ userId });
      if (count > 0) {
        await Cart.deleteMany({ userId });
      }
    }
    res.status(200).json({ message: 'Cart removed' });
  }
);

export { getCartForUser, saveCartForUser, deleteCartForUser };
