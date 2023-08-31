import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import Meta from '../../components/Meta';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/messages/ErrorMessage';
import FormContainer from '../../components/formComponents/FormContainer';
import {
  FormGroupEmailEdit,
  FormGroupPasswordEdit,
} from '../../components/formComponents/FormGroupControls';

import { setCredentials } from '../../slices/authSlice';
import { useLoginMutation } from '../../slices/usersApiSlice';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login, { isLoading, error }] = useLoginMutation();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <Meta title='Sign In' />
      <h1>Sign In</h1>
      {error && <ErrorMessage error={error} />}
      <Form onSubmit={submitHandler}>
        <FormGroupEmailEdit
          controlId='email'
          label='Email Address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormGroupPasswordEdit
          controlId='password'
          label='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button disabled={isLoading} type='submit' variant='primary'>
          Sign In
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
