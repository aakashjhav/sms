const mongoose = require("mongoose");
const courseCategoriesSchema = mongoose.Schema({
  categoryId: {
    type: String,
    required: false,
  },
  categoryName: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
  },
  categoryDescription: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model(
  "courseCategoriesModel",
  courseCategoriesSchema
);
