const Category = require('../models/category');
const { getUserById } = require('../controllers/user');

exports.getCategoryById = (req, res, next, id) => {
	Category.findById(id, (err, category) => {
		if (err || !category) {
			return res.status(400).json({ error: 'Category Not Found' });
		}
		req.category = category;
		next();
	});
};

exports.createCategory = (req, res) => {
	const category = new Category(req.body);
	category.save((err, category) => {
		if (err) return res.status(400).json({ error: 'Failed to Save Category' });
		return res.json(category);
	});
};

exports.getAllCategory = (req, res) => {
	Category.find().exec((err, categories) => {
		if (err) {
			return res.status(400).json({ error: 'Failed to get Category' });
		}
		return res.json(categories);
	});
};

exports.getCategory = (req, res) => {
	return res.json(req.category);
};

exports.updateCategory = async (req, res, next) => {
	try {
		console.log('body', req.body);
		const category = await Category.findByIdAndUpdate(
			{ _id: req.category._id },
			{ $set: { name: req.body.name } },
			{ new: true, useFindAndModify: false }
		);
		console.log(category);
		return res.json({ status: 200, message: 'Category updated successfully', category });
	} catch (error) {
		return res.json({ error: error });
	}
};

exports.deleteCategory = async (req, res) => {
	try {
		const category = req.category;
		const deletedCategory = await category.remove();
		return res.json(deletedCategory);
	} catch (err) {
		return res.status(400).json({ error: 'Not Able to DELETE' });
	}
};
