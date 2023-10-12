import { CART_URL } from '../constantsFrontend';
import { ICart } from '../types/cartTypes';

import apiSlice from './apiSlice';

// Define an API slice for cart saving
export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get a saved cart for a user
    getCartForUser: builder.query<ICart, void>({
      query: () => ({
        url: CART_URL,
      }),
    }),
    // Create a new order
    saveCartForUser: builder.mutation<string, ICart>({
      query: ({ cartItems, shippingAddress, paymentMethod, totalAmounts }) => ({
        url: CART_URL,
        method: 'POST',
        body: { cartItems, shippingAddress, paymentMethod, totalAmounts },
      }),
    }),
    deleteCartForUser: builder.mutation<string, void>({
      query: () => ({
        url: CART_URL,
        method: 'DELETE',
      }),
    }),
  }),
});

// Export generated hooks for API endpoints
export const {
  useGetCartForUserQuery,
  useSaveCartForUserMutation,
  useDeleteCartForUserMutation,
} = cartApiSlice;
