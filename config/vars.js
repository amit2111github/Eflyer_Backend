// import .env variables
const path = require('path');
// import .env variables
require('dotenv-safe').config({
	path: path.join(__dirname, '../.env'),
	sample: path.join(__dirname, '../.env.example'),
});
module.exports = {
	port: process.env.PORT,
	secret: process.env.SECRET,
	cloudinaryName: process.env.CLOUDINARY_NAME,
	cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
	cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
	stripeKey: process.env.STRIPE_KEY,
	merchantId: process.env.PAYPAL_MERCHANT_ID,
	publicKey: process.env.PAYPAL_PUBLIC_KEY,
	privateKey: process.env.PAYPAL_PRIVATE_KEY,
	googleClientId: process.env.GOOGLE_CLIENT_ID,
};
