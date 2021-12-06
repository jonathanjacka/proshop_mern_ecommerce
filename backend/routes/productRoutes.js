import express from 'express';
import asyncHandler from 'express-async-handler';
const router = express.Router();
import Product from '../models/ProductModel.js';

// @desc    Fetch all products
// @routes  GET /api/products
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const products = await Product.find({});

    res.json(products);
  }));

// @desc    Fetch single product by id
// @routes  GET /api/products/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        res.status(404);
        throw new Error(`Product with id of ${req.params.id} not found.  Either the product does not exist or the id you've entered is incorrect.`);
    } else {
        res.json(product);
    }
    
}));

export default router;