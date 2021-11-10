const express = require('express');
const router = express.Router();

const {
	getProductById,
	getProduct,
	createProduct,
	getAllProduct,
	photo,
	updateProduct,
	getAllUniqueCatgory,
	deleteProduct,
	getImages,
	getImageFromId,
} = require('../controllers/tshirt');
const { getUserById } = require('../controllers/user');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');

// params
router.param('tshirtId', getProductById);
router.param('userId', getUserById);

// create product
router.get('/getImageById/:tshirtId/:userId', isSignedIn, isAuthenticated, getImageFromId);
router.post('/create/:userId', isSignedIn, isAuthenticated, isAdmin, createProduct);

router.get('/getImage/tshirt/:link', getImages);
// update product
router.put('/:tshirtId/:userId', isSignedIn, isAuthenticated, isAdmin, updateProduct);

// delete product
router.delete('/:tshirtId/:userId', isSignedIn, isAuthenticated, isAdmin, deleteProduct);

// read route

router.get('/categories', getAllUniqueCatgory);
router.get('/photo/:tshirtId', photo);
router.get('/all', getAllProduct);
router.get('/:tshirtId', getProduct);

module.exports = router;
