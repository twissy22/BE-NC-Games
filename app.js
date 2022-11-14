const express = require("express");
const app = express();

const { getCategories } = require("./controllers/game.contoller.js")


app.get("/api/categories", getCategories);


app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;