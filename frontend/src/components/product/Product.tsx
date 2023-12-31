import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

import { CURRENCY_SYMBOL } from '../../constantsFrontend';
import { IProduct } from '../../types/productTypes';

import Rating from './Rating';

interface ProductComponentProps {
  product: IProduct;
}

const Product: React.FunctionComponent<ProductComponentProps> = ({
  product,
}) => {
  return (
    <Card id='product_card' className='my-3 p-3 rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={product.imageURL}
          alt={product.name}
          variant='top'
          img-fluid='true'
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3'>
          {CURRENCY_SYMBOL}
          {product.price.toFixed(2)}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
