const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const generateToken = require('../utils/generateToken');

// Registers a user
const registerUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;
      
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
      
  if (!validator.isEmail(email)) return res.status(400).json({ error: "Email is not valid" });
  if (!validator.isStrongPassword(password)) return res.status(400).json({ error: "Password is not strong enough" });
      
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "User already exists" });

  const hashedpwd = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ firstname, lastname, email, password: hashedpwd, role });
    const token = await generateToken(user);
    if (!token) res.status(500).json({ error: "Token generation error"})

    res.status(200).json({ data: { user, token } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
      
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
      
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });
      
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = await generateToken(user);

    res.status(200).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};
      
module.exports = {registerUser, loginUser};