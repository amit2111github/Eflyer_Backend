const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;
const ProductCartSchema = new Schema(
	{
		product: {
			type: ObjectId,
			ref: 'Product',
		},
		name: String,
		count: Number,
		price: Number,
	},
	{ timestamps: true }
);
const orderSchema = new Schema(
	{
		products: [ProductCartSchema],
		transaction_id: {},
		amount: {
			type: Number,
		},
		address: String,
		updated: Date,
		user: {
			type: ObjectId,
			ref: 'User',
		},
		status: {
			type: String,
			default: 'Received',
			enum: ['Cancelled', 'Received', 'Shipped', 'Delivered', 'Processing'],
		},
	},
	{ timestamps: true }
);
const Order = mongoose.model('Order', orderSchema);
const ProductCart = mongoose.model('ProductCart', ProductCartSchema);
module.exports = { Order, ProductCart };
