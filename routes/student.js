const express = require("express");
const router = express.Router();

const studentModel = require("../model/student");
const courseModel = require("../model/course");
const { body, validationResult } = require("express-validator");
const env = require("dotenv/config");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const auth = require("../middleware/auth");

//============POST- create Student==============//

router.post(
  "/api/student/",
  [
    body("email", "incorrect format").isEmail(),
    body("firstName", "First Name is required").notEmpty(),
    body("lastName", "lastName is required").notEmpty(),
    body("dateOfBirth", "dateOfBirth is required").notEmpty(),
    body("gender", "gender is required").notEmpty(),
    body("userName", "userName is required").notEmpty(),
    body("password", "password is required").notEmpty(),
    body("confirmPassword", "confirmPassword is required").notEmpty(),
  ],

  async (req, res) => {
    //validate request

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ validation_errors: errors.array() });
    }

    //Encrypt password
    //1.generate salt
    const salt = await bcrypt.genSalt(10);

    //2. Hash String
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const studentNew = new studentModel({
      studentId: req.body.studentId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      userName: req.body.userName,
      password: hashPassword,
      address: req.body.address,
      certificate: req.body.certificate,
      pointsEarned: req.body.pointsEarned,
      courseCart: req.body.courseCart,
      courseEnrolled: req.body.courseEnrolled,
      confirmPassword: req.body.confirmPassword,
    });

    try {
      const studentNewAdded = await studentNew.save();
      // generating token
      jwt.sign(
        {
          // studentId: studentNewAdded.studentId,
          firstName: studentNewAdded.firstName,
        },
        process.env.SECRETKEY,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) {
            return res.status(400).send(err);
          }
          res.json({ token });
        }
      );
    } catch (err) {
      res.send(err);
    }
  }
);

//============GET- get all Student==============//

router.get("/api/students/", async (req, res) => {
  try {
    const studentSearch = await studentModel.aggregate([
      // { $unwind: "$courseEnrolled" },
      {
        $unwind: { path: "$courseEnrolled", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: "coursemodels",
          localField: "courseEnrolled",
          foreignField: "courseCode",
          as: "courseinfo",
        },
      },
      {
        $group: {
          _id: "$_id",
          studentId: { $first: "$studentId" },
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          dateOfBirth: { $first: "$dateOfBirth" },
          gender: { $first: "$gender" },
          email: { $first: "$email" },
          contactNumber: { $first: "$contactNumber" },
          userName: { $first: "$userName" },
          password: { $first: "$password" },
          address: { $first: "$address" },
          certificate: { $first: "$certificate" },
          pointsEarned: { $first: "$pointsEarned" },
          courseCart: { $first: "$courseCart" },
          courseEnrolled: { $addToSet: "$courseEnrolled" },
          courses: { $push: "$courseinfo" },
        },
      },
    ]);
    res.send(studentSearch);
  } catch (err) {
    res.send(err);
  }
});

//============GET- get student by username==============//

router.get("/api/student/:userName", auth, async (req, res) => {
  try {
    const studentfind = await studentModel.aggregate([
      { $match: { userName: req.params.userName } }, // Match the student by studentId
      {
        $unwind: { path: "$courseEnrolled", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "coursemodels",
          localField: "courseEnrolled",
          foreignField: "courseCode",
          as: "courseinfo",
        },
      },
      {
        $group: {
          _id: "$_id",
          studentId: { $first: "$studentId" },
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          dateOfBirth: { $first: "$dateOfBirth" },
          gender: { $first: "$gender" },
          email: { $first: "$email" },
          contactNumber: { $first: { $ifNull: ["$contactNumber", ""] } },
          password: { $first: "$password" },
          address: { $first: { $ifNull: ["$address", ""] } },
          certificate: { $first: { $ifNull: ["$certificate", ""] } },
          pointsEarned: { $first: { $ifNull: ["$pointsEarned", 0] } }, // Provide default value 0 if pointsEarned is null
          courseCart: { $first: { $ifNull: ["$courseCart", []] } }, // Provide default value [] if courseCart is null
          courseEnrolled: { $addToSet: { $ifNull: ["$courseEnrolled", []] } }, // Provide default value [] if courseEnrolled is null
          courses: { $push: { $ifNull: ["$courseinfo", []] } },
        },
      },
    ]);

    res.send(studentfind);
  } catch (err) {
    res.send(err);
  }
});

//============GET- get student when logged in==============//

router.get("/api/student/user", (req, res) => {
  try {
    const response = "this is the response";
    res.send(response);
    console.log("This is the response:", response);
  } catch (err) {
    console.error("This is the error from the server side:", err);
    res.status(500).send("An error occurred");
  }
});
//================DELETE- Delete all============================//

router.delete("/api/removeallstudents/", auth, async (req, res) => {
  try {
    const student = await studentModel.deleteMany({});
    res.send(student);
  } catch (error) {
    res.send(error);
  }
});

//============POST- Login student/ token api==============//

router.post("/api/student/token", async (req, res) => {
  try {
    //get student using userName
    const student = await studentModel.findOne({ userName: req.body.userName });
    //if no student found- return error
    if (!student) {
      return res.status(401).send("invalid student, please try again");
    }
    //if student found- match password
    const isMatch = await bcrypt.compare(req.body.password, student.password);
    //.if password doesnt match- return error

    //401- unauthorized request error
    if (!isMatch) {
      return res.status(401).send("invalid password");
    }
    // if password matches- return student
    jwt.sign(
      {
        studentId: student.studentId,
        firstName: student.firstName,
      },
      process.env.SECRETKEY,
      { expiresIn: 36000 }, // in miliseconds
      (err, token) => {
        if (err) {
          return res.status(400).send(err);
        }
        res.json({ token });
      }
    );
  } catch (err) {
    res.send(err);
  }
});

//================================/
module.exports = router;
