import React, { useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import Message from '../components/Message';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const removeFromCartHandler = (id) => {
    console.log(`Remove item: ${id}`);
  };

  const checkoutHandler = () => {
    console.log('checking out...');
    navigate('../login?redirect=shipping');
  };

  const centerContent = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const centerContentSubTotal = {
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  };

  return (
    <Row>
      <h1>Shopping Cart:</h1>
      <Col md={8}>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty. <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row style={centerContent}>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={item.quantity}
                      onChange={({ target }) =>
                        dispatch(addToCart(item.product, Number(target.value)))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((idx) => (
                        <option key={idx + 1} value={idx + 1}>
                          {idx + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item style={centerContentSubTotal}>
              <h2>
                Subtotal (
                {cartItems.reduce(
                  (total, currentItem) => total + currentItem.quantity,
                  0
                )}
                ) items
              </h2>
              $
              {cartItems
                .reduce(
                  (total, currentItem) =>
                    total + currentItem.quantity * currentItem.price,
                  0
                )
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item style={centerContentSubTotal}>
              <Button
                type='button'
                className='btn-block'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
