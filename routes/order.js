const express = require('express');
const router = express.Router();

const { getUserById, pushOrderInPurchaseList } = require('../controllers/user');
const { isAuthenticated, isSignedIn, isAdmin } = require('../controllers/auth');
const { getOrderById, createOrder, getAllOrder, getOrderStatus, updateStatus } = require('../controllers/order');
const { updateSoldAndStock } = require('../controllers/tshirt');

// params
router.param('userId', getUserById);
router.param('orderId', getOrderById);

// create

router.post('/create/:userId', isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateSoldAndStock, createOrder);

// get all order

router.get('/all/:userId', isSignedIn, isAuthenticated, isAdmin, getAllOrder);
// status of order
router.get('/status/:orderId/:userId', isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
router.put('/:orderId/status/:userId', isSignedIn, isAuthenticated, isAdmin, updateStatus);
module.exports = router;
