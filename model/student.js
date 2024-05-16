const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  // couseno: string, required
  // name: string, required
  // description: string, optional,
  // credits: number, default to 5

  studentId: {
    type: Number,
    required: false,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: false,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  certificate: {
    type: String,
    required: false,
  },
  pointsEarned: {
    type: String,
  },
  courseCart: {
    type: Array,
  },
  courseEnrolled: {
    type: Array,
  },
});

module.exports = mongoose.model("studentModel", studentSchema);
