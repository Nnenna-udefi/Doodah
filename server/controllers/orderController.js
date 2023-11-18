const Order = require('../models/orderModel');
const mongoose = require('mongoose');
const Product = require('../models/productModel');
const { ObjectId } = require('mongoose');

// Get all orders
const getAllOrders = async (req, res) => {
  Order.find()
    .select('-__v')
    .populate('product', 'name price')
    .exec()
    .then(orders => {
      res.status(200).json({
        count: orders.length,
        orders: orders.map(order => {
          return {
            id: order._id,
            user: order.user,
            product: order.product,
            quantity: order.quantity,
            address: order.address,
            totalAmount: order.totalAmount,
            status: order.status,
            orderDate: order.orderDate,
            request: {
              type: 'GET',
              url: 'http://localhost:4000/api/orders/' + order._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
// Adds a new order
const addOrder = async (req, res) => {
  const {
    user,
    product,
    quantity,
    address,
    totalAmount,
    status,
    orderDate
  } = req.body;
  switch (true) {
    case !user:
      return res.status(500).send({ error: 'userID is Required' });
    case !product:
      return res.status(500).send({ error: 'ProductID is Required' });
    case !quantity:
      return res.status(500).send({ error: 'Quantity is Required' });
    case !address:
      return res.status(500).send({ error: 'Address is Required' });
    case !totalAmount:
      return res.status(500).send({ error: 'Amount is Required' });
  }
  // Check if Product ID passed is valid
  const valid = await Product.findById(product);

  if (!valid) {
    return res.status(404).json({ error: 'Product not found' });
  }
  try {
    const order = new Order({
      user,
      product,
      quantity,
      address,
      totalAmount,
      status,
      orderDate
    });
    order.save()
      .then((result) => {
        console.log(result);
        res.status(200).json({
          message: 'Order created successfully',
          order,
          request: {
            type: 'GET',
            url: 'http://localhost:4000/api/orders/' + order._id
          }
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

// Gets a single order

const getOrder = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(401).json({ error: 'No Order ID' });
  }
  Order.findById(id)
    .populate('product', 'name price')
    .exec()
    .then(order => {
      res.status(200).json({
        order,
        request: {
          type: 'GET',
          url: 'http://localhost:4000/orders'
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(401).json({ error: 'Invalid ID' });
  }

  Order.findByIdAndDelete(id)
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order deleted successfully',
        request: {
          type: 'POST',
          url: 'http://localhost:4000/orders'
        }
      });
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
};

const UpdateOrder = async (req, res) => {
  const { id }= req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(401).json({ error: 'Invalid ID' });
  }

  Order.findByIdAndUpdate(id, { ...req.body }, { new: true })
    .exec()
    .then(order => {
      res.status(200).send({
        message: 'Updated order successfully',
        order,
        request: {
          type: 'GET',
          url: 'http://localhost:4000/orders'
        }
      });
    });
};

module.exports = { addOrder, getAllOrders, getOrder, deleteOrder, UpdateOrder };

