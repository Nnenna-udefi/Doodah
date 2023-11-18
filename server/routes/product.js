const express = require('express');
const {
    getAllProducts,
    getAProduct,
    addProduct,
    updateProduct, 
    deleteProduct,
    filterProduct,
    searchProduct,
} = require('../controllers/productController');
const isAdmin = require('../middleware/isAdmin');
const requireLogin = require("../middleware/requireLogin");
const cache = require('../middleware/cache');
const formidable = require("express-formidable");
const { uploadImage, imgResize } = require('../middleware/uploadImages');

const router = express.Router()

// Gets all product with label popular
router.get('/popular', cache(300), filterProduct);

// List all products
router.get('/', cache(300), getAllProducts);

// Get a product by ID
router.get('/:id', cache(300), getAProduct);

// Update a product by ID
router.patch('/update/:id', requireLogin, isAdmin, updateProduct);

// Create a new product
router.post('/add', 
requireLogin,
isAdmin,
formidable(),
addProduct);
// Delete a product by ID
router.delete('/delete/:id', requireLogin, isAdmin, deleteProduct);

// Searches for product

router.get('/search/:keyword', searchProduct)

module.exports = router;