import React from 'react';
import { Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

import LogoSVG from '../../assets/LogoSVG';
import Loader from '../../components/general/Loader';
import { logout } from '../../slices/authSlice';
import { resetCart } from '../../slices/cartSlice';
import {
  useSaveCartForUserMutation,
  useDeleteCartForUserMutation,
} from '../../slices/cartApiSlice';
import { useLogoutMutation } from '../../slices/usersApiSlice';
import type { RootState } from '../../store';

import SearchBox from './SearchBox';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart);

  const [saveCartToDB, { isLoading: savingCart }] =
    useSaveCartForUserMutation();
  const [deleteCartFromDB, { isLoading: deletingCart }] =
    useDeleteCartForUserMutation();
  const [logoutApiCall, { isLoading: loggingOut }] = useLogoutMutation();

  const logoutHandler = async () => {
    console.log('== logoutHandler = cart ', cart);
    console.log('== logoutHandler = cartItems ', cart.cartItems);
    try {
      // Save cart to database if there are items in local cart
      if (cart.cartItems.length > 0) {
        await saveCartToDB(cart).unwrap();
      } else {
        // if there are no items in local state then delete cart
        await deleteCartFromDB().unwrap();
      }
      // Logout
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const loadingOrProcessing = savingCart || deletingCart || loggingOut;

  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            {loadingOrProcessing ? (
              <Loader size={'60px'} />
            ) : (
              <Navbar.Brand id='LINK_orbital_shop'>
                <LogoSVG />
                <span style={{ marginLeft: '10px' }}>Orbital Shop</span>
              </Navbar.Brand>
            )}
          </LinkContainer>

          <Navbar.Toggle aria-controls='basic_navbar_nav' />
          <Navbar.Collapse id='basic_navbar_nav'>
            <Nav className='ms-auto'>
              <SearchBox />
              <LinkContainer to='/cart'>
                <Nav.Link id='LINK_header_cart'>
                  <FaShoppingCart /> Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                      {cart.cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id='LINK_header_username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item id='LINK_my_profile'>
                        My Profile
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/myorders'>
                      <NavDropdown.Item id='LINK_my_orders'>
                        My Orders
                      </NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item
                      id='LINK_header_logout'
                      onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link id='LINK_header_sign_in'>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='LINK_header_adminmenu'>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item id='LINK_header_products'>
                      Products
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item id='LINK_header_users'>
                      Users
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item id='LINK_header_orders'>
                      Orders
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
