import asyncHandler from 'express-async-handler';
import Product from '../models/ProductModel.js';

// @desc    Fetch all products
// @routes  GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch single product by id
// @routes  GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error(
      `Product with id of ${req.params.id} not found.  Either the product does not exist or the id you've entered is incorrect.`
    );
  } else {
    res.json(product);
  }
});

// @desc    delete single product by id
// @routes  DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error(
      `Product with id of ${req.params.id} not found.  Either the product does not exist or the id you've entered is incorrect.`
    );
  } else {
    await product.remove();
    res.json({ message: 'Product deleted', product });
  }
});

// @desc    create single product by id
// @routes  POST /api/products/
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'SampleName',
    price: '0',
    user: req.user._id,
    image: '/images/sample.png',
    brand: 'sampleBrand',
    category: 'sampleCategory',
    countInStock: 0,
    numReviews: 0,
    description: 'sampleDescription',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update/edit single product by id
// @routes  PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, image, brand, category, countInStock, description } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found!');
  } else {
    product.name = name;
    product.price = price;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.description = description;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
