import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    res.status(401);
    throw new Error('Not authorized, no token!');
  } else {
    try {
      console.log('Token found!');

      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token', decoded);

      req.user = await User.findById(decoded.userId).select('-password');
      console.log(req.user);

      next();
    } catch (error) {
      console.error('Error:', error);
      res.status(401);
      throw new Error('Not authorized - token has failed.');
    }
  }
});

export { protect };
