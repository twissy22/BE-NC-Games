const express = require("express");
const app = express();

const { getCategories, getReview } = require("./controllers/game.contoller.js")


app.get("/api/categories", getCategories);


app.all("/*", (req, res, next)=>{
  res.status(404).send({msg: "path not found"});
})
app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;