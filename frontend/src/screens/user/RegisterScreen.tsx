import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import {
  TextField,
  EmailField,
  PasswordField,
} from '../../components/form/FormComponents';
import FormContainer from '../../components/form/FormContainer';
import {
  textField,
  passwordField,
} from '../../components/form/ValidationSpecs';
import ErrorMessage from '../../components/general/ErrorMessage';
import Loader from '../../components/general/Loader';
import Meta from '../../components/general/Meta';
import { setCredentials } from '../../slices/authSlice';
import { useRegisterMutation } from '../../slices/usersApiSlice';
import type { RootState } from '../../store';

function RegisterScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [register, { isLoading: registering, error: errorRegistering }] =
    useRegisterMutation();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: textField().required('Required'),
      email: textField().required('Required').email('Invalid email address'),
      password: passwordField().required('Required'),
    }),
    onSubmit: async (values) => {
      const name = values.name;
      const email = values.email;
      const password = values.password;
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        // Do nothing because the useRegisterMutation will set errorRegister
      }
    },
  });

  const loadingOrProcessing = registering;

  return (
    <FormContainer>
      <Meta title='Registration' />
      <h1>Register account</h1>
      {loadingOrProcessing && <Loader />}
      {errorRegistering && <ErrorMessage error={errorRegistering} />}
      <Form onSubmit={formik.handleSubmit}>
        <TextField controlId='name' label='Full name' formik={formik} />
        <EmailField controlId='email' label='Email' formik={formik} />
        <PasswordField controlId='password' label='Password' formik={formik} />
        <Button
          id='BUTTON_register'
          disabled={loadingOrProcessing || !formik.dirty}
          type='submit'
          variant='primary mt-2'>
          Register
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          Already have an account?{' '}
          <Link
            id='LINK_already_have_an_account'
            to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}
export default RegisterScreen;
