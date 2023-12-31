import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import FormContainer from '../form/FormContainer';

import Meta from './Meta';

const NotFound: React.FunctionComponent = () => {
  const location = useLocation();

  const { pathname } = location;
  return (
    <FormContainer>
      <Meta title='Page not found' />
      <h1>Oops! </h1>
      <p>
        <strong>The requested page </strong>({pathname})
        <strong> does not exist.</strong>
      </p>
      <p></p>
      <Link to='/'>Go to home page</Link>
    </FormContainer>
  );
};

export default NotFound;
