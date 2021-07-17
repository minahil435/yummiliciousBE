const Recipe = require("../model/Recipe");
const User = require("../../user/model/User.js");

const getAllRecipes = async (req, res) => {
    try {
        const { decodedJwt } = res.locals;

        let payload = await User.findOne({ email: decodedJwt.email })
            .populate({
                path: "recipes",
                model: Recipe,
                select: "-__v",
            })
            .select("-email -password -firstName -lastName -__v -_id -username");

        res.json(payload);
    } catch (e) {
        res.status(500).json({ e: e, message: e.message });
    }
};

const saveRecipe = async (req, res) => {
    try {
        const { idMeal, strMealThumb, strMeal } = req.body;
        console.log(req.body)

        const newRecipe = new Recipe({
            idMeal,
            strMealThumb,
            strMeal,
        });

        const savedNewRecipe = await newRecipe.save();
        //when you saved a friend - an ID is created from the databse
        const { decodedJwt } = res.locals;
        console.log(res.locals);
        //now we have to find the user ID
        const foundTargetUser = await User.findOne({ email: decodedJwt.email })
        
        foundTargetUser.recipes.push(savedNewRecipe._id);

        await foundTargetUser.save();

        res.json(savedNewRecipe);
    } catch (e) {
        res.status(500).json({ e: e, message: e.message });
    }
};


const alreadylikedRecipe = async (req, res) => {
    try {
        const {idMeal} = req.body;
        console.log("hi",req.body.idMeal)
        const { decodedJwt } = res.locals;
        const foundTargetUser = await User.findOne({ email: decodedJwt.email }).populate({
            path: "recipes",
            model: Recipe,
            select: "-__v",
        })
        .select("-email -password -firstName -lastName -__v -_id -username");

        let found = false

         foundTargetUser.recipes.forEach(element => {
            console.log(element.idMeal)
            if (element.idMeal === idMeal) {
                found = true
          }
        });

    res.json({ message: "success", payload: found });
    } catch (e) {
        res.status(500).json({ e: e, message: e.message });
    }
};



const deleteRecipeById = async (req, res, next) => {
    try {
        let deletedRecipe = await Recipe.findByIdAndRemove(req.params.id);

        const { decodedJwt } = res.locals;
        let foundUser = await User.findOne({ email: decodedJwt.email });
        let foundUserArray = foundUser.recipes;
        let filteredRecipesArray = foundUserArray.filter((id) => {
            id.toString() !== deletedRecipe._id.toString();
        });

        foundUser.recipes = filteredRecipesArray;
        await foundUser.save();

        res.json({ message: "success", payload: deletedRecipe });
    } catch (e) {
        next(e);
    }
};

module.exports = {
    getAllRecipes,
    saveRecipe,
    deleteRecipeById,
    alreadylikedRecipe
}
