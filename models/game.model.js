const db = require("../db/connection.js");
const {checkreviewID, checkUser} = require("../db/seeds/utils")

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

exports.selectComments = (id)=> {
  return checkreviewID(id).then(()=>{
  return db
  .query(`
  SELECT comment_id, votes, created_at, body, comments.review_id, users.username AS author 
  FROM comments 
  JOIN users ON users.username = comments.author
  WHERE comments.review_id =$1 ORDER BY created_at DESC;
  `,[id])
  .then((result) => {
    return result.rows;
  });
})
};

exports.insertComment = (id, body)=> {
  
  return checkreviewID(id).then(()=>{
    return checkUser(body.author).then(()=>{
    let queryStr =
    "INSERT INTO comments (author,body,review_id) VALUES ($1,$2,$3) RETURNING *;";
    const review_id = id
  const queryVals = [
    body.author,
    body.body, review_id]
    if (queryVals.includes(undefined)) {
      return Promise.reject({ status: 400, msg: "Insufficient data" });
    }
    return db.query(queryStr, queryVals)
.then((result) => { 
    return result.rows;
   
  });
})
  })
};
