const { selectCategories, selectReviews, selectReview } = require("../models/game.model");

exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({ categories });
      })
      .catch((err) => {
        next(err);
      });
}
exports.getReviews = (req, res, next) => {
    selectReviews()
    .then((reviews) => {

        res.status(200).send({ reviews });
      })
      .catch((err) => {
        next(err);
      });
}
exports.getReviewById = (req, res, next) => {
  const {id} = req.params
  selectReview(id)
  .then((reviews) => {
  
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
  }