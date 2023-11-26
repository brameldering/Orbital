import React from 'react';
import { Form, Button } from 'react-bootstrap';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormContainer from 'form/FormContainer';
import { TextNumField } from 'form/FormComponents';
import { textField } from 'form/ValidationSpecs';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import { RESET_PASSWORD_CONFIRM_PAGE } from 'constants/client-pages';
import { useResetPasswordMutation } from 'slices/usersApiSlice';

interface IFormInput {
  email: string;
}

const schema = yup.object().shape({
  email: textField()
    .required('Email is required')
    .email('Invalid email address'),
});

const PasswordResetScreen = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: { email: '' },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const [
    resetPassword,
    { isLoading: isProcessing, error: errorResettingPassword },
  ] = useResetPasswordMutation();
  const onSubmit = async () => {
    const email = getValues('email');
    try {
      await resetPassword({ email }).unwrap();
      Router.push(RESET_PASSWORD_CONFIRM_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const onError = (error: any) => {
    console.log('ERROR:::', error);
  };

  return (
    <FormContainer>
      <Meta title='Reset Password' />
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <h1>Reset Password</h1>
        {isProcessing && <Loader />}
        <TextNumField
          controlId='email'
          label='Your email address as known to us'
          register={register}
          error={errors.email}
          setError={setError}
        />
        {errorResettingPassword && (
          <ErrorBlock error={errorResettingPassword} />
        )}
        <br />
        <Button
          id='BUTTON_reset_password'
          type='submit'
          variant='primary mt-0'
          disabled={isProcessing || !isDirty}>
          Reset Password
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PasswordResetScreen;
