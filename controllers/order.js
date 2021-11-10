const { Order } = require('../models/order');

exports.getOrderById = async (req, res, next, id) => {
	try {
		const order = await Order.findById(id).populate('products.product', 'name price');
		req.order = order;
		next();
	} catch (err) {
		return res.json({ err: 'Not Able to get Order By Id' });
	}
};

exports.createOrder = async (req, res) => {
	try {
		req.body.order.user = req.profile._id;
		const order = new Order(req.body.order);
		const newOrder = await order.save();
		return res.json(newOrder);
	} catch (err) {
		return res.json({ error: 'Failed to Create Order' });
	}
};

exports.getAllOrder = async (req, res) => {
	try {
		const orders = await Order.find().populate('user').sort({ createdAt: 'desc' });
		return res.json(orders);
	} catch (err) {
		return res.json({ err: 'Failed to get All Order' });
	}
};

exports.getOrderStatus = async (req, res) => {
	try {
		return res.json(Order.schema.path('status').enumValues);
	} catch (err) {
		return res.json({ err: 'Failed to get Status' });
	}
};

exports.updateStatus = async (req, res) => {
	try {
		const updateOrder = await Order.update({ _id: req.order._id }, { $set: { status: req.body.status } });
		return res.json(updateOrder);
	} catch (err) {
		return res.json({ err: 'Failed to update status' });
	}
};
