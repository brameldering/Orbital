import React, { useEffect } from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { IProduct } from 'src/types/productTypes';

import ErrorMessage from '../components/general/ErrorMessage';
import Loader from '../components/general/Loader';
import Meta from '../components/general/Meta';
import Paginate from '../components/general/Paginate';
import Product from '../components/product/Product';
import { setConfig } from '../slices/configSlice';
import { useGetCartForUserQuery } from '../slices/cartApiSlice';
import { useGetVATandShippingFeeQuery } from '../slices/ordersApiSlice';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { pageNumber, keyword } = useParams();

  const {
    data: catalogData,
    isLoading: isLoadingCatalog,
    error: errorLoadingCatalog,
  } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const {
    data: VATandShippingFee,
    isLoading: loadingVATandShippingFee,
    error: errorLoadingVATandShippingFee,
  } = useGetVATandShippingFeeQuery();

  const { data: cartFromDB } = useGetCartForUserQuery();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (VATandShippingFee) {
      dispatch(setConfig(VATandShippingFee));
    }
  }, [VATandShippingFee]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <>
      {keyword && (
        <Link id='BUTTON_back' to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      {isLoadingCatalog || loadingVATandShippingFee ? (
        <Loader />
      ) : errorLoadingCatalog ? (
        <ErrorMessage error={errorLoadingCatalog} />
      ) : errorLoadingVATandShippingFee ? (
        <ErrorMessage error={errorLoadingVATandShippingFee} />
      ) : (
        <>
          <Meta title='Products' />
          <h1>Cart</h1>
          {cartFromDB && cartFromDB.cartItems && (
            <ListGroup variant='flush'>
              {cartFromDB.cartItems.map((item) => (
                <ListGroup.Item id='product_item' key={item.productId}>
                  <Row>
                    <Col md={4}>{item.productName}</Col>
                    <Col md={2}>{item.price.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          <h1>Products</h1>
          <Row>
            {catalogData &&
              catalogData.products.length > 0 &&
              catalogData.products.map((product: IProduct) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            {!catalogData ||
              (catalogData.products.length === 0 && (
                <p>No products match your search</p>
              ))}
          </Row>
          {catalogData && (
            <Paginate
              pages={catalogData.pages}
              page={catalogData.page}
              keyword={keyword ? keyword : ''}
            />
          )}
        </>
      )}
    </>
  );
};

export default HomeScreen;
