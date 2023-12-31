import { useFormik } from 'formik';
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { TextField } from '../../components/form/FormComponents';
import FormContainer from '../../components/form/FormContainer';
import { textField } from '../../components/form/ValidationSpecs';
import Meta from '../../components/general/Meta';
import CheckoutSteps from '../../components/order/CheckoutSteps';
import { saveShippingAddress } from '../../slices/cartSlice';
import type { RootState } from '../../store';

const ShippingScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = cart;

  const formik = useFormik({
    initialValues: {
      address: shippingAddress?.address || '',
      postalCode: shippingAddress?.postalCode || '',
      city: shippingAddress?.city || '',
      country: shippingAddress?.country || '',
    },
    validationSchema: Yup.object({
      address: textField().required('Required'),
      postalCode: textField().required('Required'),
      city: textField().required('Required'),
      country: textField().required('Required'),
    }),
    onSubmit: async (values) => {
      const address = values.address;
      const postalCode = values.postalCode;
      const city = values.city;
      const country = values.country;
      dispatch(saveShippingAddress({ address, postalCode, city, country }));
      navigate('/payment');
    },
  });

  return (
    <>
      <Meta title='Shipping Address' />
      <CheckoutSteps currentStep={1} />
      <FormContainer>
        <h1>Address</h1>
        <Form onSubmit={formik.handleSubmit}>
          <TextField controlId='address' label='Address' formik={formik} />
          <TextField
            controlId='postalCode'
            label='Postal Code'
            formik={formik}
          />
          <TextField controlId='city' label='City' formik={formik} />
          <TextField controlId='country' label='Country' formik={formik} />
          <Button id='BUTTON_continue' type='submit' variant='primary mt-2'>
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
