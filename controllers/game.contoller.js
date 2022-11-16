const { selectCategories, selectReviews, selectReview, selectComments } = require("../models/game.model");

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
  exports.getCommentsById = (req, res, next) => {
    const {id} = req.params
    selectComments(id)
    .then((comments) => {
    
        res.status(200).send({ comments });
      })
      .catch((err) => {
        next(err);
      });
    }