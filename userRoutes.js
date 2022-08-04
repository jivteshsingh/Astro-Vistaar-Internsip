const express = require("express");
const { registeruser, authoriseduser, allusers } = require("./userControllers");
const { protect } = require("./authMiddleware");

const router = express.Router();

router.route('/').post(registeruser);
router.route('/login').post(authoriseduser);
router.route('/').get(protect, allusers);

module.exports = router;
