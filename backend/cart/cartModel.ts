import mongoose from 'mongoose';
import { CartModel, CartSchema, CartDocument } from 'types/mongoose.gen';

const cartItemsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  productName: { type: String, required: true },
  imageURL: { type: String, required: true },
  price: { type: Number, required: true },
  countInStock: { type: Number, required: true },
  qty: { type: Number, required: true },
});

const cartTotalAmountsSchema = new mongoose.Schema({
  itemsPrice: {
    type: Number,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    default: 0.0,
  },
});

const cartSchema: CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    cartItems: [cartItemsSchema],
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    paymentMethod: {
      type: String,
    },
    totalAmounts: cartTotalAmountsSchema,
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model<CartDocument, CartModel>('Cart', cartSchema);

export default Cart;
