const express = require("express");
const app = express();

const { getCategories, getReviews, getReviewById } = require("./controllers/game.contoller.js")


app.get("/api/categories", getCategories);
app.get("/api/reviews",getReviews)
app.get("/api/reviews/:id",getReviewById)
app.use((err, req, res, next) => {
  if (err.code === "22P02") res.status(400).send({ msg: "bad request!" });
  else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.status).send({ msg: err.msg });
});

app.all("/*", (req, res, next)=>{
  res.status(404).send({msg: "path not found"});
})
module.exports = app;