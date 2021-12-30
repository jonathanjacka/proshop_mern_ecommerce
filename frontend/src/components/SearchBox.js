import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const submitHandler = (event) => {
    event.preventDefault();

    if (keyword.trim()) {
      navigate(`../search/${keyword.trim()}`);
    } else {
      navigate('../');
    }
  };

  return (
    <Form onSubmit={submitHandler} inline='true' style={{ display: 'flex' }}>
      <Form.Control
        type='text'
        name='q'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search products...'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-info' className='py-2 px-4 mx-2'>
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
