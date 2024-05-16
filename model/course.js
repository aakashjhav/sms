const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  // couseno: string, required
  // name: string, required
  // description: string, optional,
  // credits: number, default to 5

  courseCode: {
    type: String,
    required: true,
    maxlength: 20,
    unique: true,
  },
  courseName: {
    type: String,
    required: true,
    maxlength: 100,
    unique: true,
  },

  description: {
    type: String,
    required: false,
  },
  courseDuration: {
    type: Number,
    required: true,
  },

  courseFees: {
    type: Number,
    required: true,
  },
  courseCategoryId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CourseModel", courseSchema);
