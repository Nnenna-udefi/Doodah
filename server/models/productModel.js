const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"]
  },
  description: {
    type: String,
    required: [true, "Product description is required"]
  },

  // category: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Category",
  //   required: true,
  // },
  slug: {
    type: String,
    unique: true, 
    lowercase: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"]
  },
  brand: {
    type: String,
    required: [true, "Product brand is required"]
  },
  stock_quantity: {
    type: Number,
    required: [true, "Product stock quantity is required"]
  },
  images: [],
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String
      }
    }
  ],
  label: {
    type: String,
  },
  address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
}, {timestamps: true}); // Added timestamp for sorting products that were added recently

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
