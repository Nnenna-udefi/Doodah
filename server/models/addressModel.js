const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  number: {
    type: Number,
  },
  street: {
    type: String,
    required: [true, "Street address is required"]
  },
  city: {
    type: String,
    required: [true, "City is required"]
  },
  state: {
    type: String,
    required: [true, "State is required"]
  },
  postalCode: {
    type: String,
    required: [true, "Postal code is required"]
  },
  country: {
    type: String,
    required: [true, "Country is required"]
  }
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
