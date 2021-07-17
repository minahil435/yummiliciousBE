
const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../utils/jwtMiddleware");

const {
  saveRecipe,
  getAllRecipes,
  deleteRecipeById,
  alreadylikedRecipe
} = require("./controller/recipeController");

router.get("/get-all-recipes", jwtMiddleware, getAllRecipes);
router.post("/save-recipe", jwtMiddleware, saveRecipe);
router.delete("/delete-recipe-by-id/:id", jwtMiddleware, deleteRecipeById);
router.post("/already-liked-Recipe",jwtMiddleware,alreadylikedRecipe )

module.exports = router;