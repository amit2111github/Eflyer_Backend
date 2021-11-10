require("dotenv").config();
var cloudinary = require("cloudinary").v2;
const {
  cloudinaryName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
} = require("../config/vars");

cloudinary.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
  secure: true,
});

module.exports = { cloudinary };
