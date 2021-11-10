const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getUserById } = require('../controllers/user');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { merchantId, publicKey, privateKey } = require('../config/vars');
// gettign braintree
const braintree = require('braintree');
const gateway = new braintree.BraintreeGateway({
	environment: braintree.Environment.Sandbox,
	merchantId,
	publicKey,
	privateKey,
});

router.param('userId', getUserById);

// to get a token from server
router.get('/client_token/:userId', isSignedIn, isAuthenticated, async (req, res) => {
	gateway.clientToken
		.generate()
		.then((response) => {
			console.log('At least here');
			return res.send(response);
		})
		.catch((err) => {
			console.log(err);
			return res.json(err);
		});
});

// getting nonce
router.post('/makePayment/:userId', isSignedIn, isAuthenticated, async (req, res) => {
	try {
		const nonceFromTheClient = req.body.payment_method_nonce;
		const data = await gateway.transaction.sale({
			amount: req.body.amount,
			paymentMethodNonce: nonceFromTheClient,
			options: {
				submitForSettlement: true,
			},
		});
		return res.json(data);
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
