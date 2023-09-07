import asyncHandler from '../../general/middleware/asyncHandler.js';
import IdSequence from '../../general/models/idSequenceModel.js';
import Product from '../models/productModel.js';
import { CLOUDINARY_SAMPLE_IMAGE_URL } from '../../constantsBackend.js';

// @desc    Fetch all products
// @route   GET /api/products/v1
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PRODUCTS_PER_PAGE;
  let page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  let products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  // Check if page is empty after a delete refresh
  if (page > 1 && products.length === 0) {
    // Current page is empty, set page - 1 and refetch
    page--;
    products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  }
  res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/v1/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // NOTE: checking for valid ObjectId to prevent CastError moved to separate
  // middleware. See README for more info.

  const product = await Product.findById(req.params.id);
  if (product) {
    return res.status(200).json(product);
  } else {
    // NOTE: this will run if a valid ObjectId but no product was found
    // i.e. product may be null
    console.log('Product not found Bram');
    res.status(404);
    throw new Error('Product not found Bram');
  }
});

// @desc    Create a product
// @route   POST /api/products/v1
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const seqProductId = await IdSequence.findOneAndUpdate(
    { sequenceName: 'sequenceProductId' },
    { $inc: { sequenceCounter: 1 } },
    { returnOriginal: false, upsert: true }
  );
  const sequenceProductId =
    'PRD-' + seqProductId.sequenceCounter.toString().padStart(8, '0');

  const product = new Product({
    sequenceProductId,
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: CLOUDINARY_SAMPLE_IMAGE_URL,
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/v1/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  console.log('=== updateProduct', req.params.id);
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/v1/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/v1/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/v1/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.status(200).json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
