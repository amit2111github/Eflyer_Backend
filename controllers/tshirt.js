const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const FileReader = require('filereader');
const { cloudinary } = require('../utils/cloudinary');

const axios = require('axios');

exports.getImages = async (req, res) => {
	try {
		const { link } = req.params;
		const { resources } = await cloudinary.search.expression(`folder:tshirt`).execute();
		let ans;
		resources.forEach((r) => {
			if (r.public_id === `tshirt/${link}`) ans = r;
		});
		// console.log("lookinh for url ",ans);
		return res.json(ans);
	} catch (err) {
		return res.json(400).json({ error: 'Something Went Wrong' });
	}
};
exports.getImageFromId = async (req, res) => {
	try {
		const pro = await Product.findById(req.product._id);
		const { resources } = await cloudinary.search.expression(`folder:tshirt`).execute();
		let ans;
		resources.forEach((r) => {
			if (r.public_id === pro.link) ans = r;
		});
		return res.json(ans);
	} catch (err) {
		return res.json(400).json({ error: 'Something Went Wrong' });
	}
};
exports.getProductById = async (req, res, next, id) => {
	try {
		const product = await Product.findById(id).populate('category', 'name');
		req.product = product;
		next();
	} catch (err) {
		return res.status(400).json({ error: 'Cant Find the Product' });
	}
};

// getting product by id
exports.getProduct = (req, res) => {
	req.product.photo = undefined;
	return res.status(200).json(req.product);
};

// middleware
exports.photo = (req, res, next) => {
	if (req.product.photo) {
		res.set('Content-Type', req.product.photo.contentType);
		return res.send(req.product.photo.data);
	}
	next();
};

// creating product
exports.createProduct = (req, res, next) => {
	const form = formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, async (err, fields, files) => {
		if (err) {
			return res.status(400).json('Wrong file');
		}
		const { name, price, description, category, stock } = fields;

		if (!name || !price || !description || !category || !stock) {
			console.log(name, price, description, category, stock);
			return res.status(400).json({ error: 'Please enter all field' });
		}

		let product = new Product(fields);

		if (files.photo && files.photo.size > 3000000) {
			return res.status(400).json({ error: 'File is too BIG!' });
		}

		//uploading in cloudinary
		cloudinary.uploader.upload(
			files.photo.path,
			{
				resource_type: 'image',
				public_id: 'tshirt/' + files.photo.name,
				eager: [
					{ width: 300, height: 300, crop: 'pad', audio_codec: 'none' },
					{
						width: 160,
						height: 100,
						crop: 'crop',
						gravity: 'south',
						audio_codec: 'none',
					},
				],
				eager_async: true,
			},
			(error, result) => {
				if (error) return res.status(400).json({ err: 'Failed to upload' });
				product.link = result.public_id;
				product.photo.data = fs.readFileSync(files.photo.path);
				product.photo.contentType = files.photo.type;
				product.save((err, product) => {
					if (err) {
						return res.json(400).status({ error: 'Cant Able to Save in DB' });
					}
					return res.status(200).json(product);
				});
			}
		);
	});
};

exports.getAllProduct = async (req, res) => {
	console.log('All in');
	try {
		let limit = +req.query.limit || 6;
		let sortBy = req.query.sortBy || '_id';
		const product = await Product.find()
			.select('-photo')
			.populate('category')
			.sort([[sortBy, 'asc']])
			.limit(limit);
		return res.json(product);
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'Not Able to get All Product' });
	}
};

exports.deleteProduct = async (req, res) => {
	try {
		const product = req.product;
		const deleted = await cloudinary.uploader.destroy(product.link, {
			resource_type: 'image',
		});
		const deletedProduct = await product.remove();
		return res.json(deletedProduct);
	} catch (err) {
		return res.status(400).json({ error: 'Failed to DELETE Product' });
	}
};

exports.updateProduct = async (req, res, next) => {
	try {
		const form = formidable.IncomingForm();
		form.keepExtensions = true;
		form.parse(req, async (err, fields, files) => {
			if (err) {
				return res.status(400).json({ error: 'Wrong file' });
			}
			if (!files || !files.photo) {
				return res.status(400).json({ error: 'Photo required' });
			}
			const { name, price, description, category, stock } = fields;
			if (!name || !price || !description || !category || !stock) {
				console.log(name, price, description, category, stock);
				return res.status(400).json({ error: 'Please enter all field' });
			}
			let product = req.product;

			const deleted = await cloudinary.uploader.destroy(product.link, {
				resource_type: 'image',
				public_id: 'tshirt/' + files.photo.name,
			});

			product = _.extend(product, fields);

			if (files.photo && files.photo.size > 3000000) {
				return res.status(400).json({ error: 'File is too BIG!' });
			}
			//uploading in cloudinary

			const updatedImage = await cloudinary.uploader.upload(files.photo.path, {
				resource_type: 'image',
				public_id: 'tshirt/' + files.photo.name,
				eager: [
					{ width: 300, height: 300, crop: 'pad', audio_codec: 'none' },
					{
						width: 160,
						height: 100,
						crop: 'crop',
						gravity: 'south',
						audio_codec: 'none',
					},
				],
				eager_async: true,
			});

			product.link = updatedImage.public_id;
			product.photo.data = fs.readFileSync(files.photo.path);
			product.photo.contentType = files.photo.type;
			const Newproduct = await product.save();
			return res.status(200).json(Newproduct);
		});
	} catch (err) {
		return res.json({ error: 'Failed to Update the Product' });
	}
};

exports.updateSoldAndStock = async (req, res, next) => {
	try {
		let operation = req.body.order.products.map((prods) => {
			return {
				updateOne: {
					filter: { _id: prods._id },
					update: { $inc: { stock: -prods.count, sold: +prods.count }, useFindAndModify: false },
					new: true,
					useFindAndModify: false,
				},
			};
		});
		const result = await Product.bulkWrite(operation);
		next();
	} catch (err) {
		console.log(err);
		return res.json({ error: 'Failed to Update stock and sold' });
	}
};

exports.getAllUniqueCatgory = async (req, res, next) => {
	try {
		const result = await product.distinct('categories');
		return res.json(result);
	} catch (err) {
		return res.json(400).json({ err: 'Not Able to get All Unique category' });
	}
};
