const { selectCategories, selectReviews, selectReview, selectComments, insertComment, updateVotes } = require("../models/game.model");

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

    exports.postComment= (req, res, next) => {
      const {id} = req.params
      insertComment(id,req.body)
      .then((comment) => {
      
          res.status(201).send({ comment });
        })
        .catch((err) => {
          next(err);
        });
      }
    
      exports.patchVotes= (req, res, next) => {
        const {review_id} = req.params
        updateVotes(review_id,req.body)
        .then((review) => {
        
            res.status(200).send({ review });
          })
          .catch((err) => {
            next(err);
          });
        }