const Product = require('../models/productModel');
const mongoose = require('mongoose');
const cloudinaryImageUpload = require('../utils/cloudinary');
const fs = require('fs');
const slugify = require('slugify');

// List all products: GET /api/products
const getAllProducts = async (req, res) => {
  const limit = 20; // 20 products per page to paginate
  let total;

  try {
    // Filtering through the products
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'fields'];
    excludedFields.forEach((element) => delete queryObj[element]);

    let queryStr = JSON.stringify(queryObj);
    console.log(queryStr);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    let query = Product.find(JSON.parse(queryStr));

    // Sorts the products by their field keyword alphabetically
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    // pagination
    const { page } = req.query;
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);
    if (req.query.page) {
      total = await Product.countDocuments();
      if (skip >= total) return res.status(404).json({ error: 'Page does not exist' });
    }

    const products = await query;
    res.status(200).send({
      success: true,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Erorr in getting products',
      error: error.message
    });
  }
};

// Get product details: GET /api/products/:id
const getAProduct = async (req, res) => {
  const { id } = req.params;

  // Checks if the id passed is a valid mongoose id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid ID' });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ error: 'No such product' });
  }
  res.status(200).json(product);
};

// Create a new product (admin-only): POST /api/products/add
const addProduct = async (req, res) => {
  console.log(req.fields);
  try {
    const { name, description, price, brand, stock_quantity, label } = req.fields;
    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: 'Name is Required' });
      case !description:
        return res.status(500).send({ error: 'Description is Required' });
      case !price:
        return res.status(500).send({ error: 'Price is Required' });
      case !brand:
        return res.status(500).send({ error: 'Brand is Required' });
      case !stock_quantity:
        return res.status(500).send({ error: 'Stock Quantity is Required' });
    }

    const products = new Product({ ...req.fields });
    let images;
    // Uploads the photos to cloudinary and generates a new url path
    try {
      const urls = [];
      const files = req.files;
      console.log(files);

      for (const fieldName in files) {
        if (files.hasOwnProperty(fieldName)) {
          const file = files[fieldName];
          const { path } = file;
          console.log(path);
          const cloudPath = await cloudinaryImageUpload(path);
          console.log(cloudPath);
          urls.push(cloudPath);
          fs.unlinkSync(path);
        }
      }
      images = urls.map((file) => {
        console.log(file);
        return file;
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
    products.images = images;
    products.slug = slugify(name);
    await products.save();
    res.status(201).send({
      message: 'Product Created Successfully',
      products
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: error.message
    });
  }
};

// Update a product (admin-only): PUT /api/products/update/:id
const updateProduct = async (req, res) => {
  const { id } = req.params;

  // Checks if ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid ID' });
  }
  const product = await Product.findByIdAndUpdate(id, { ...req.body }, { new: true });

  if (!product) {
    return res.status(404).send({
      message: 'No such product',
      product
    });
  }
  res.status(200).send({
    message: 'Product updated successfully',
    product
  });
};

// Delete a product (admin-only): DELETE /api/products/delete/:id
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  // Checks if ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid ID' });
  }
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return res.status(404).json({ error: 'Invalid ID' });
  }
  res.status(200).send({
    message: 'Product deleted successfully'
  });
};

const filterProduct = async (req, res) => {
  try {
    // Gets all popular products, sorted by the newest
    const popularProducts = await Product
      .find({ label: 'popular' })
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      popularProducts
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: error.message
    });
  }
};

const searchProduct = async (req, res) => {
  try {
    const { keyword } = req.query;
    const results = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    });
    res.status(200).json({ results });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  getAllProducts,
  getAProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  filterProduct,
  searchProduct
};
