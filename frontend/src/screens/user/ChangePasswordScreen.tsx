import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { PasswordField } from '../../components/form/FormComponents';
import FormContainer from '../../components/form/FormContainer';
import { passwordField } from '../../components/form/ValidationSpecs';
import ErrorMessage from '../../components/general/ErrorMessage';
import Loader from '../../components/general/Loader';
import Meta from '../../components/general/Meta';
import ModalConfirmBox from '../../components/general/ModalConfirmBox';
import { setCredentials } from '../../slices/authSlice';
import { useUpdatePasswordMutation } from '../../slices/usersApiSlice';
import type { RootState } from '../../store';

const ChangePasswordScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<any>();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [
    updatePassword,
    { isLoading: updatingPassword, error: errorUpdating },
  ] = useUpdatePasswordMutation();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: passwordField(),
      newPassword: passwordField(),
    }),
    onSubmit: async (values) => {
      const currentPassword = values.currentPassword;
      const newPassword = values.newPassword;
      try {
        if (userInfo) {
          const res = await updatePassword({
            _id: userInfo._id,
            currentPassword,
            newPassword,
          }).unwrap();
          dispatch(setCredentials({ ...res }));
          toast.success('Password updated');
          navigate('/profile');
        } else {
          throw Error('Error changing password!');
        }
      } catch (err) {
        setError({ message: 'Error changing password' });
      }
    },
  });

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    navigate('/profile');
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (formik.dirty) {
      setShowChangesModal(true);
    } else {
      navigate('/profile');
    }
  };

  const loadingOrProcessing = updatingPassword;

  return (
    <>
      <Meta title='Change Password' />{' '}
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Are you sure you want to go back?'
        body='All the new and changed info will be lost.'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <Button
        className='btn btn-light my-3'
        onClick={goBackHandler}
        disabled={loadingOrProcessing}>
        Go Back
      </Button>
      <FormContainer>
        <h1>Change Password</h1>
        {error && <ErrorMessage error={error} />}
        {errorUpdating && <ErrorMessage error={errorUpdating} />}
        <Form onSubmit={formik.handleSubmit}>
          <PasswordField
            controlId='currentPassword'
            label='Current Password'
            formik={formik}
          />
          <PasswordField
            controlId='newPassword'
            label='New Password'
            formik={formik}
          />
          <Button
            id='BUTTON_update'
            disabled={loadingOrProcessing || !formik.dirty}
            type='submit'
            variant='primary mt-2'>
            Update
          </Button>
          {updatingPassword && <Loader />}
        </Form>
      </FormContainer>
    </>
  );
};

export default ChangePasswordScreen;
