const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
 idMeal: {
    type: String,
  },
  strMealThumb: {
    type: String,
  },
  strMeal: {
    type: String,
  },
});

module.exports = mongoose.model("recipe", RecipeSchema);
