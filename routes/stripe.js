const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getUserById } = require('../controllers/user');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { stripeKey } = require('../config/vars');
const stripe = require('stripe')(stripeKey);
const router = express.Router();
router.param('userId', getUserById);

router.post('/makePayment/:userId', isSignedIn, isAuthenticated, async (req, res) => {
	try {
		console.log('userId', req.params.userId);
		const { product, token, amount, description } = req.body;
		const idempotencyKey = uuidv4();
		const data = await stripe.customers.create({
			email: token.email,
			source: token.id,
		});

		const charge = await stripe.charges.create(
			{
				amount: amount,
				currency: 'INR',
				customer: data.id,
				receipt_email: token.email,
				description,
				shipping: {
					name: token.card.name,
					address: {
						line1: token.card.address_line1,
						line2: token.card.address_line2,
						country: token.card.address_country,
						city: token.card.address_city,
						postal_code: token.card.address_zip,
					},
				},
			},
			{ idempotencyKey }
		);
		return res.json(charge);
	} catch (err) {
		console.log(err);
	}
});
module.exports = router;
