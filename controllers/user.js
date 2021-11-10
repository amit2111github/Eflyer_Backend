const User = require('../models/user');
const { Order } = require('../models/order');

exports.getUserById = (req, res, next, id) => {
	User.findById(id, (err, user) => {
		if (err || !user) return res.status(400).json({ msg: 'No such user' });
		req.profile = user;
		next();
	});
};

exports.getUser = (req, res) => {
	req.profile.salt = undefined;
	req.profile.encry_password = undefined;
	return res.json(req.profile);
};

// Update user

exports.updateUser = (req, res) => {
	console.log('Udated inside');
	User.findByIdAndUpdate(
		{ _id: req.profile._id },
		{ $set: req.body },
		{ new: true, useFindAndModify: false },
		(err, updatedUser) => {
			if (err || !updatedUser) {
				return res.status(400).json({ error: 'Updation failed' });
			}
			updatedUser.salt = undefined;
			updatedUser.encry_password = undefined;
			return res.status(200).json({ updatedUser });
		}
	);
};

exports.getAllPurchaseList = (req, res) => {
	Order.find({ user: req.profile._id })
		.populate({
			path: 'products',
			populate: {
				path: 'product',
				model: 'Product',
				populate: {
					path: 'category',
					model: 'Category',
				},
			},
		})
		.sort({ createdAt: 'desc' })
		.exec((err, list) => {
			if (err || !list) return res.status(400).json({ error: 'No Order' });
			console.log(list);
			return res.json(list);
		});
};

exports.pushOrderInPurchaseList = (req, res, next) => {
	let purchases = [];
	req.body.order.products.forEach((item) => {
		purchases.push({
			...item,
			amount: req.body.order.amount,
			transction_id: req.body.order.transction_id,
		});
	});

	User.findOneAndUpdate(
		{ _id: req.profile._id },
		{ $push: { purchases: purchases } },
		{ new: true, useFindAndModify: false },
		(err, purchases) => {
			if (err) {
				return res.status(400).json({ error: 'Unable to Save Purchase List' });
			}
			console.log(purchases);
			next();
		}
	);
};
