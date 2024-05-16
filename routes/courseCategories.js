const express = require("express");
const router = express.Router();
const courseCategoryModel = require("../model/courseCategories");
const auth = require("../middleware/auth");
//============POST- create course categories==============//

router.post("/api/createcoursecategories", auth, async (req, res) => {
  const courseCategoryNew = new courseCategoryModel({
    categoryId: req.body.categoryId,
    categoryName: req.body.categoryName,
    categoryDescription: req.body.categoryDescription,
  });

  try {
    const courseCategoryNewAdded = await courseCategoryNew.save();
    res.send(courseCategoryNewAdded);
  } catch (err) {
    res.send(err);
  }
});
//============GET- get all course categories==============//
router.get("/api/coursecategories", auth, async (req, res) => {
  try {
    const courseCategoriesSearch = await courseCategoryModel.find();
    res.send(courseCategoriesSearch);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
