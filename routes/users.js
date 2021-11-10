var express = require("express");
var router = express.Router();
const { isAuthenticated, isSignedIn, isAdmin } = require("../controllers/auth");
const {
  getUserById,
  getUser,
  updateUser,
  getAllPurchaseList,
  pushOrderInPurchaseList,
} = require("../controllers/user");

/* GET users listing. */

// get User
router.param("userId", getUserById);
router.get("/:userId", isSignedIn, isAuthenticated, getUser);

// udpdate user

router.put("/:userId", isSignedIn, isAuthenticated, updateUser);

// get All purchase of a user
router.get("/order/:userId", isSignedIn, isAuthenticated, getAllPurchaseList);

// pushing orders in purchase list of user

router.post("/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList);

module.exports = router;
