import React, { useEffect } from 'react';
import { Table, Button, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getAllUsers, deleteUser } from '../actions/userActions';

const UserListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getAllUsers());
    } else {
      navigate('../login');
    }
  }, [dispatch, navigate, userInfo, successDelete]);

  const deleteHandler = (id) => {
    if (
      window.confirm(`Are you sure you wish to permanently delete this user?`)
    ) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <>
      <h1>All Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i
                      className='fas fa-check'
                      style={{ color: '#00aead' }}
                    ></i>
                  ) : (
                    <i
                      className='fas fa-times'
                      style={{ color: '#e15459' }}
                    ></i>
                  )}
                </td>
                <td
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}
                >
                  <Nav.Link as={Link} to={`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </Nav.Link>
                  {userInfo._id !== user._id && (
                    <Button
                      variant='light'
                      className='btn-sm'
                      style={{ color: 'red' }}
                      onClick={() => deleteHandler(user._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
