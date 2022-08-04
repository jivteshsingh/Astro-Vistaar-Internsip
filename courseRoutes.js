const express = require("express");
const { protect } = require("./authMiddleware");
const { addcourse, allcourses, enrollcourse, enrolleduser, enrolledcourse } = require("./courseControllers")

const router = express.Router();

router.route('/').post(protect,addcourse);
router.route('/').get(protect,allcourses);
router.route('/enroll').put(protect,enrollcourse);
router.route('/enrolled').get(protect,enrolleduser);
router.route('/enrolled/course').get(protect,enrolledcourse)

module.exports = router;
