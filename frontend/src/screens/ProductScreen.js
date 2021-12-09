import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProductDetails } from '../actions/productActions';
import { addToCart } from '../actions/cartActions';

const ProductScreen = () => {
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listProductDetails(params.id));
  }, [dispatch, params.id]);

  const addToCartHandler = () => {
    // navigate(`../cart/${params.id}?qty=${quantity}`);
    dispatch(addToCart(params.id, quantity));
    navigate('../cart');
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row className='pt-5'>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={6}>
            <ListGroup variant='flush' style={{ padding: '1rem' }}>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
              <ListGroup.Item>
                Description: {product.description}
              </ListGroup.Item>
            </ListGroup>

            <Card>
              <ListGroup style={{ padding: '1rem', textAlign: 'center' }}>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Quantity:</Col>
                      <Col>
                        <Form.Control
                          as='select'
                          value={quantity}
                          onChange={({ target }) => setQuantity(target.value)}
                          style={{
                            margin: 'auto',
                            padding: '0',
                            textAlign: 'center',
                            maxWidth: '50%',
                          }}
                        >
                          {[...Array(product.countInStock).keys()].map(
                            (idx) => (
                              <option key={idx + 1} value={idx + 1}>
                                {idx + 1}
                              </option>
                            )
                          )}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    className='btn-block'
                    type='button'
                    disabled={product.countInStock > 0 ? false : true}
                    style={{
                      width: '60%',
                      display: 'block',
                      margin: '1rem auto',
                    }}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col md={4}></Col>
        </Row>
      )}

      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
    </>
  );
};

export default ProductScreen;
