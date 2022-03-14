const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    getAllFavoriteCocktail,
    addCocktailToFavorite,
    deleteFavoriteCocktail,
} = require('./controller/Controller');

router.get("/get-all-cocktail",
    passport.authenticate("jwt-user",{session:false}),
    getAllFavoriteCocktail,
);

router.post("/add-cocktail",
    passport.authenticate("jwt-user",{session:false}),
    addCocktailToFavorite,
);

router.delete("/delete-cocktail/:id",
    passport.authenticate("jwt-user",{session:false}),
    deleteFavoriteCocktail,
);

module.exports = router;