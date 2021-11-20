const validator = require('validator');
const User = require('../models/user');
const { userSchema } = require('../models/user');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { secret } = require('../config/vars');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const { googleClientId } = require('../config/vars');
const client = new OAuth2Client(googleClientId);

https: exports.signOut = (req, res, next) => {
	res.clearCookie('token');
	return res.status(200).json({ msg: 'User sign out successfully' });
};

const sendMail = async (name, email) => {
	try {
		console.log(name, email);
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'amit.dev.nit@gmail.com',
				pass: 'AmitMandal@2111',
			},
		});
		let info = await transporter.sendMail({
			from: '"Eflyer 👻" <amit.dev.nit@gmail.com>',
			to: email,
			subject: 'Hello ✔',
			html: `<p>Hello</p> <h2>${name}</h2> </br> <p>Welcome to the Eflyer Hope you will enjoy in shopping.</p>`,
		});
		const response = await transporter.sendMail(info);
		console.log(response);
	} catch (err) {
		console.log('Error was', err);
	}
};
exports.signUp = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const user = new User(req.body);
	user.save(async (err, data) => {
		if (err) return res.status(400).json({ error: 'NOT able to save user in DB' });
		await sendMail(user.name, user.email);
		return res.json({
			id: user._id,
			name: user.name,
			email: user.email,
		});
	});
};

exports.signIn = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({ error: 'Email not exists' });
		}
		if (!user.authenticate(req.body.password)) {
			return res.status(401).json({ error: 'Wrong Password ' });
		}
		// create token
		const token = jwt.sign({ _id: user._id }, secret);
		//put token in cookie
		res.cookie('token', token, { expire: new Date() + 9999 });

		//send response to front end
		const { _id, name, email, role } = user;
		return res.json({ token, user: { _id, name, email, role } });
	});
};

// google signin
exports.googleSignin = async (req, res, next) => {
	try {
		// console.log('Inside', googleClientId);
		const token = req.body.tokenId;
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: googleClientId,
		});
		// console.log(' ticket ', ticket);
		const { email } = ticket.getPayload();
		const user = await User.findOne({ email: email });
		if (!user || user === undefined) return res.json({ error: 'Email not Exist in Database' });
		const SignIntoken = jwt.sign({ _id: user._id }, secret);
		res.cookie('token', SignIntoken, { expire: new Date() + 9999 });
		const { _id, name, role } = user;
		return res.json({ token: SignIntoken, user: { _id, name, email, role } });
	} catch (err) {
		return res.json({ error: 'Something Went Wrong' });
	}
};
exports.isSignedIn = expressJwt({
	secret,
	userProperty: 'auth',
});
exports.isAuthenticated = (req, res, next) => {
	let checker = req.auth && req.profile && req.profile._id == req.auth._id;
	if (!checker) {
		return res.status(403).json({ error: 'ACCESS DENIED' });
	}
	console.log('Fine');
	next();
};
exports.isAdmin = (req, res, next) => {
	if (req.profile.role === 0) {
		return res.status(403).json({ error: 'You are not admin' });
	}
	next();
};
