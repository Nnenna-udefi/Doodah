const mongoose = require('mongoose');
const schema = mongoose.Schema
const bcrypt = require('bcrypt');

const userSchema = new schema({
    firstname: {
        type: String,
        required: [true, "Firstname Required"]
    },
    lastname: {
        type: String,
        required: [true, "Lastname Required"]
    },
    email: {
        type: String,
        required: [true, "Email Required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password Required"]
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Possible roles
        default: "user"}
});

const User = mongoose.model('User', userSchema);
module.exports = User;