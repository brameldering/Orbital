import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoaderProps {
  size?: string;
}

const Loader: React.FunctionComponent<LoaderProps> = ({ size = '100px' }) => {
  return (
    <Spinner
      animation='border'
      role='status'
      style={{
        width: size,
        height: size,
        margin: 'auto',
        display: 'block',
      }}></Spinner>
  );
};

export default Loader;
