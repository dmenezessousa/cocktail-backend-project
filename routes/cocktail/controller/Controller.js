
const Cocktail = require("../model/Cocktail");
const User = require("../../users/model/User");
const getErrorMessage = require("../../lib/errorHandler/errorHandler");

async function getAllFavoriteCocktail(req, res) {
  try {
    let foundUser = await User.findOne({ email: req.user.email }).select(
      "-__v"
    );
    let allFavoriteCocktail = await Cocktail.find({ user: foundUser._id }).populate(
      "cocktailOwner",
      "userName"
    );

    res.json({ message: "Success", payload: allFavoriteCocktail });
  } catch (e) {
    res.status(500).json(getErrorMessage(e));
  }
}

async function addCocktailToFavorite(req, res) {
  const { title, cocktailPoster, cocktailID } = req.body;

  try {
    let foundUser = await User.findOne({ email: req.user.email }).select(
      "-__v"
    );
    const createdCocktail = new Cocktail({
      title,
      cocktailPoster,
      cocktailID,
      cocktailOwner: foundUser._id,
    });

    let savedCocktail = await createdCocktail.save();

    foundUser.cocktailHistory.push(savedCocktail._id);

    await foundUser.save();

    return res.json({ message: "Success", savedCocktail });
  } catch (e) {
    res.status(500).json(getErrorMessage(e));
  }
}

async function deleteFavoriteCocktail(req, res) {
  try {
    let deletedCocktail = await Cocktail.findByIdAndRemove(req.params.id);

    if (!deletedCocktail) {
      return res
        .status(404)
        .json({ message: "Error", error: "Cocktail not found" });
    } else {
      let foundUser = await User.findOne({ email: req.user.email }).select(
        "-__v"
      );
      let userCocktail = foundUser.cocktailHistory;

      let userCocktailsHistory = userCocktail.filter(
        (item) => item._id.toString() !== req.params.id
      );

      foundUser.cocktailHistory = userCocktailsHistory;

      await foundUser.save();

      res.json({ message: "Deleted", payload: deletedCocktail });
    }
  } catch (e) {
    res.status(500).json(getErrorMessage(e));
  }
}

module.exports = {
    getAllFavoriteCocktail,
    addCocktailToFavorite,
    deleteFavoriteCocktail,
};