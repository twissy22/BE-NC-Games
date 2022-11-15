const db = require("../db/connection.js");

exports.selectCategories = ()=> {
    return db
    .query(
      `SELECT *
  FROM categories
  ;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectReviews = ()=> {

    return db
    .query(

      `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id)::int AS comment_count 
    FROM reviews 
    JOIN users ON users.username = reviews.owner LEFT JOIN comments ON comments.review_id = reviews.review_id 
    GROUP BY reviews.review_id ORDER BY created_at DESC;`

    )
    .then((result) => {
      return result.rows;
    });
};
exports.selectReview = (id)=> {
  return db
  .query(
    `SELECT review_id, title,review_body,designer,review_img_url, votes, created_at, categories.slug AS category, users.username AS owner
    FROM reviews 
    JOIN Categories ON categories.slug = reviews.category
    JOIN users ON users.username = reviews.owner
    WHERE review_id =$1;
    `, [id]
  )
  .then((result) => {
    if(result.rows.length ===0){
     return Promise.reject({status: 404, msg: "no review matching that id"})
    }
    return result.rows;
  });
};