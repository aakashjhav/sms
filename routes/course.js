const express = require("express");
const router = express.Router();

const courseModel = require("../model/course");
const auth = require("../middleware/auth");
//============POST- create course==============//

router.post("/api/createcourse/", auth, async (req, res) => {
  const courseNew = new courseModel({
    courseCode: req.body.courseCode,
    courseName: req.body.courseName,
    description: req.body.description,
    courseDuration: req.body.courseDuration,
    courseCategoryId: req.body.courseCategoryId,
    courseFees: req.body.courseFees,
  });

  try {
    const courseNewAdded = await courseNew.save();
    res.send(courseNewAdded);
  } catch (err) {
    res.send(err);
  }
});

//============GET- get all courses==============//

router.get("/api/courses/", auth, async (req, res) => {
  try {
    const coursesSearch = await courseModel.aggregate([
      {
        $lookup: {
          from: "coursecategoriesmodels",
          localField: "courseCategoryId",
          foreignField: "categoryId",
          as: "courseCategory",
        },
      },
    ]);
    res.send(coursesSearch);
  } catch (err) {
    res.send(err);
  }
});

//============GET- get course by id==============//

router.get("/api/course/:courseno", async (req, res) => {
  try {
    const coursefind = await courseModel.findOne({
      courseno: req.params.courseno,
    });
    res.send(coursefind);
  } catch (err) {
    res.send(err);
  }
});

//============PUT- update course by id==============//

router.put("/api/course/:courseno", async (req, res) => {
  try {
    const courseUpdate = await courseModel.updateOne(
      { courseno: req.params.courseno },
      { $set: req.body }
    );
    res.send(courseUpdate);
  } catch (err) {
    res.send(err);
  }
});

//============DELETE- delete course by id==============//

router.delete("/api/course/:courseno", async (req, res) => {
  try {
    const courseDelete = await courseModel.deleteOne({
      courseno: req.params.courseno,
    });
    res.send(courseDelete);
  } catch (err) {
    res.send(err);
  }
});

//============DELETE- delete all course =============//

router.delete("/api/removeallcourses/", auth, async (req, res) => {
  try {
    const courses = await courseModel.deleteMany({});
    res.send(courses);
  } catch (error) {
    res.send(error);
  }
});

//================================/
module.exports = router;
