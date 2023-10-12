import React, { useEffect } from 'react';
import { Button, Row, Col, ListGroup, Alert } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ErrorMessage from '../../components/general/ErrorMessage';
import Loader from '../../components/general/Loader';
import Meta from '../../components/general/Meta';
import CheckoutSteps from '../../components/order/CheckoutSteps';
import OrderItemLine from '../../components/order/OrderItemLine';
import OrderSummaryBlock from '../../components/order/OrderSummaryBlock';
import { clearCartItems } from '../../slices/cartSlice';
import { useDeleteCartForUserMutation } from '../../slices/cartApiSlice';
import { useCreateOrderMutation } from '../../slices/ordersApiSlice';
import type { RootState } from '../../store';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart);

  const [createOrder, { isLoading: creatingOrder, error: errorCreatingOrder }] =
    useCreateOrderMutation();
  const [deleteCartFromDB, { isLoading: deletingCart }] =
    useDeleteCartForUserMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    const orderItems = cart.cartItems.map((item) => {
      return {
        productId: item.productId,
        productName: item.productName,
        imageURL: item.imageURL,
        price: item.price,
        qty: item.qty,
      };
    });
    try {
      const res = await createOrder({
        orderItems: orderItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        totalAmounts: cart.totalAmounts,
      }).unwrap();
      await deleteCartFromDB().unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      // Do nothing because useCreateOrderMutation will set errorCreatingOrder in case of an error
      console.log('Error! == PlaceOrderScreen == PlaceOrderHandler', err);
    }
  };

  const loadingOrProcessing =
    cart.cartItems.length === 0 || creatingOrder || deletingCart;

  return (
    <>
      <Meta title='Confirm Order' />
      <CheckoutSteps currentStep={3} />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.postalCode} {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Alert variant='info'>Your cart is empty</Alert>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <OrderItemLine item={item} />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <OrderSummaryBlock totalAmounts={cart.totalAmounts} />
              <ListGroup.Item>
                {errorCreatingOrder && (
                  <ErrorMessage error={errorCreatingOrder} />
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  id='BUTTON_place_order'
                  type='button'
                  className='btn-block mt-2'
                  disabled={loadingOrProcessing}
                  onClick={placeOrderHandler}>
                  Place Order
                </Button>
                {creatingOrder && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
