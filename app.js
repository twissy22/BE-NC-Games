const express = require("express");
const app = express();

const { getCategories, getReviews } = require("./controllers/game.contoller.js")


app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);


app.all("/*", (req, res, next)=>{
  res.status(404).send({msg: "path not found"});
})

module.exports = app;