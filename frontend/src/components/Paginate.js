import React from 'react';
// import { Pagination } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const Paginate = ({ total, page }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const baseURL =
    path.split('/page/')[0] === '/' ? '' : path.split('/page/')[0];

  return (
    total > 1 && (
      <Pagination className='justify-content-center my-3'>
        {[...Array(total).keys()].map((p) => (
          <Pagination.Item
            key={p}
            active={p + 1 === page}
            onClick={() => navigate(`${baseURL}/page/${p + 1}`)}
          >
            {p + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
