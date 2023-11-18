const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User is required"]
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, "Product is required"]
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"]
  },    
  address: {
    type: String,
    required: [true, "Shipping address is required"]
  },
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"]
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;