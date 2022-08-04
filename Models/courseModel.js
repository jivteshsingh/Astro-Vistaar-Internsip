const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
  {
  title:{ type: String, required: true },
  description:{ type: String, required: true, unique: true },
  start:{ type: Date, required: true },
  end:{ type: Date, required: true },
  instructor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  enrollments:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
],
},
{
  timestamps: true
}
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
