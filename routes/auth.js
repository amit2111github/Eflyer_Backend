var express = require('express');
const { body, validationResult } = require('express-validator');
var router = express.Router();
const User = require('../models/user.js');
const { signOut, signUp, signIn, isSignedIn, googleSignin } = require('../controllers/auth');
const user = require('./users');
/* GET home page. */

router.get('/signout', signOut);

router.post(
	'/signup',
	[
		body('name').isLength({ min: 3 }).withMessage('Name should be at least 3 chars long'),
		body('email').isEmail().withMessage('Email is required'),
		body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 chars long'),
	],
	signUp
);
// signUpWithGoogle
router.post('/signinwithGoogle', googleSignin);
router.post(
	'/signin',
	[
		body('email').isEmail().withMessage('Email is required'),
		body('password').isLength({ min: 1 }).withMessage('Password is required'),
	],
	signIn
);

// router.get("/testroute", isSignedIn, (req, res, next) => {
//   return res.json({ msg: "Success" , user : req.auth });
// });

module.exports = router;
