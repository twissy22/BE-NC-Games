const express = require("express");
const app = express();

const { getCategories, getReviews, getReviewById, getCommentsById, postComment, patchVotes, getUsers, deleteComment} = require("./controllers/game.contoller.js")

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews",getReviews)
app.get("/api/reviews/:id",getReviewById)
app.get("/api/reviews/:id/comments",getCommentsById)
app.post("/api/reviews/:id/comments", postComment)
app.patch("/api/reviews/:review_id", patchVotes)
app.get("/api/users",getUsers)
app.delete("/api/comments/:comment_id",deleteComment)
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
module.exports = app