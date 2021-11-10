const express = require('express');
const router = express.Router();
const {
	getCategory,
	deleteCategory,
	updateCategory,
	getCategoryById,
	createCategory,
	getAllCategory,
} = require('../controllers/category');
const { getUserById } = require('../controllers/user');
const { isAuthenticated, isSignedIn, isAdmin } = require('../controllers/auth');
// params
router.param('categoryId', getCategoryById);
router.param('userId', getUserById);

// creating a category by amdin
router.post(
	'/create/:userId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	createCategory
);

//get All category
router.get('/All', getAllCategory);

//get a category
router.get('/:categoryId', getCategory);

// update category
router.put('/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, updateCategory);

//delete category

router.delete('/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, deleteCategory);

module.exports = router;
