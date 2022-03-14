const mongoose = require("mongoose");

const cocktailSchema = new mongoose.Schema(
  {
    title: { type: String },
    cocktailPoster: { type: String },
    cocktailID: { type: String },
    cocktailOwner: { type: mongoose.Schema.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cocktail", cocktailSchema);