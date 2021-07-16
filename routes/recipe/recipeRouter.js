
const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../utils/jwtMiddleware");

const {
  saveRecipe,
  getAllRecipes,
  deleteRecipeById,
} = require("./controller/recipeController");

router.get("/get-all-recipes", jwtMiddleware, getAllRecipes);
router.post("/save-recipe", jwtMiddleware, saveRecipe);
router.delete("/delete-recipe-by-id/:id", jwtMiddleware, deleteRecipeById);

module.exports = router;