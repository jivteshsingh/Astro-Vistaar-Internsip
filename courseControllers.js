const asyncHandler = require("express-async-handler");
const Course = require("./Models/courseModel");
const User = require("./Models/userModel");

const addcourse = asyncHandler(async(req,res) => {
  const userRole = req.user.role;
  if(userRole == "TEACHER"){
    const { title, description, start, end } = req.body;
    if(!title || !description || !start || !end) {
      res.status(400);
      throw new Error("Please enter all the fields.")
    }

    const courseExists = await Course.findOne({ title });
    if(courseExists) {
      res.status(400);
      throw new Error("Course Already Created.");
    }

    var course = await Course.create({ title, description, start, end, instructor:req.user._id });
    course = await course.populate("instructor","name contact email")
    if(course){
      res.json(course);
      const created = await User.findByIdAndUpdate(req.user._id,{$push:{created:course._id}},{new:true})
      .populate("created");

    }else{
      res.status(401);
      throw new Error("Failed To Create The Course.");
    }

  }else{
    res.send(401);
    throw new Error("Only Teachers can Add Courses");
  }
});

const allcourses = asyncHandler(async(req,res) => {
  const userRole = req.user.role;

  if(userRole == "TEACHER"){
    const courses = await Course.find({ instructor:req.user._id })
    res.send(courses);
  }

  if(userRole == "STUDENT"){
    const courses = await Course.find();
    res.send(courses);
  }

});

const enrollcourse = asyncHandler(async(req,res) => {
  const { courseId } = req.body;
  const course = await Course.find({_id:courseId});
  const starts = course[0].start;
  const date = new Date();

  const alreadyEnrolled = course[0].enrollments;

  for(var i = 0;i < alreadyEnrolled.length;i++){
    if(alreadyEnrolled[i] = req.user._id){
      res.status(404);
      throw new Error("User already Enrolled.")
    }
  }

  if(date < starts){
    const enrolled = await Course.findByIdAndUpdate(courseId,{$push:{enrollments:req.user._id}},{new:true}).populate("enrollments","name contact email");
    const enrolledcourses = await User.findByIdAndUpdate(req.user._id,{$push:{enrolled:courseId}},{new:true}).populate("enrolled");

    if(!enrolled) {
      res.status(404);
      throw new Error("Course not Enrolled.")
    }else{
      res.json(enrolled);
    }
  }






});

const enrolleduser = asyncHandler(async(req,res) => {
  const { courseId } = req.body;
  const course = await Course.find({_id:courseId}).populate("enrollments","name contact email");;
  const enrolled = course[0].enrollments;
  res.send(enrolled);

});

const enrolledcourse = asyncHandler(async(req,res) => {
  const users = await User.find({_id:req.user._id}).populate("enrolled");
  res.send(users);
})

module.exports = { addcourse, allcourses, enrollcourse, enrolleduser, enrolledcourse };
