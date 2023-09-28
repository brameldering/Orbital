import { ICart } from '../types/cartTypes';
import { IFeesConfig } from '../types/configTypes';

const roundTo2Decimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

export const updateCart = (state: ICart) => {
  console.log('updateCart state');
  console.log(state);

  const configInfoLocalStorage: string | null =
    localStorage.getItem('configInfo');

  if (!configInfoLocalStorage) {
    throw new Error('TO DO === HANDLE THIS ERROR');
  }

  const feesConfig: IFeesConfig = JSON.parse(configInfoLocalStorage);

  state.totalAmounts.itemsPrice = roundTo2Decimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  state.totalAmounts.shippingPrice = roundTo2Decimals(
    state.cartItems.length === 0 ||
      state.totalAmounts.itemsPrice > feesConfig.ThresholdFreeShipping
      ? 0
      : feesConfig.ShippingFee
  );
  state.totalAmounts.taxPrice = roundTo2Decimals(
    (roundTo2Decimals(feesConfig.VATPercentage) / 100) *
      state.totalAmounts.itemsPrice
  );
  state.totalAmounts.totalPrice = roundTo2Decimals(
    state.totalAmounts.itemsPrice +
      state.totalAmounts.shippingPrice +
      state.totalAmounts.taxPrice
  );

  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
