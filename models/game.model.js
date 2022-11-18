const db = require("../db/connection.js");
const {
  checkreviewID,
  checkUser,
  checkCategory,
  checkCommentId
} = require("../db/seeds/utils");

exports.selectCategories = () => {
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

exports.selectReviews = (sort_by = "created_at", order = "DESC", category) => {
  const validColumns = [
    "owner",
    "title",
    "created_at",
    "category",
    "votes",
    "designer",
    "comment_count",
  ];
  const validOrders = ["DESC", "ASC", "asc", "desc"];

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid sort query" });
  }
  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid sort order" });
  }
  let queryStr = `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id)::int AS comment_count 
  FROM reviews 
  JOIN users ON users.username = reviews.owner LEFT JOIN comments ON comments.review_id = reviews.review_id `;
  const queryVals = [];
  if (category) {
    queryVals.push(category);
    queryStr += "WHERE category = $1 ";
  }

  queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`;
  const promise1 = db.query(queryStr, queryVals);
  const promise2 = db.query("SELECT * FROM categories WHERE slug= $1;", [
    category,
  ]);
  return Promise.all([promise1, promise2]).then((values) => {
    if (category && values[1].rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "no category matching entered category",
      });
    }
    return values[0].rows;
  });
};
exports.selectReview = (id) => {
  return checkreviewID(id).then(() => {
    return db
      .query(
        `SELECT owner,review_body, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id)::int AS comment_count 
    FROM reviews 
    JOIN users ON users.username = reviews.owner LEFT JOIN comments ON comments.review_id = reviews.review_id 
    JOIN Categories ON categories.slug = reviews.category 
    WHERE reviews.review_id = $1 
    GROUP BY reviews.review_id ORDER BY created_at DESC
    ;`,
        [id]
      )
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "no review matching that id",
          });
        }
        return result.rows;
      });
  });
};

exports.selectComments = (id) => {
  return checkreviewID(id).then(() => {
    return db
      .query(
        `
  SELECT comment_id, votes, created_at, body, comments.review_id, users.username AS author 
  FROM comments 
  JOIN users ON users.username = comments.author
  WHERE comments.review_id =$1 ORDER BY created_at DESC;
  `,
        [id]
      )
      .then((result) => {
        return result.rows;
      });
  });
};

exports.insertComment = (id, body) => {
  return checkreviewID(id).then(() => {
    return checkUser(body.author).then(() => {
      let queryStr =
        "INSERT INTO comments (author,body,review_id) VALUES ($1,$2,$3) RETURNING *;";
      const review_id = id;
      const queryVals = [body.author, body.body, review_id];
      if (queryVals.includes(undefined)) {
        return Promise.reject({ status: 400, msg: "Insufficient data" });
      }
      return db.query(queryStr, queryVals).then((result) => {
        return result.rows;
      });
    });
  });
};

exports.updateVotes = (id, body) => {
  return checkreviewID(id).then(() => {
    let queryStr =
      "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2  RETURNING *;";
    const review_id = id;
    const queryVals = [body.inc_vote, review_id];
    if (queryVals.includes(undefined)) {
      return Promise.reject({ status: 400, msg: "Insufficient data" });
    }
    return db.query(queryStr, queryVals).then((result) => {
      return result.rows;
    });
  });
};
exports.selectUsers = () => {
  return db
    .query(
      `SELECT name, username, avatar_url
    FROM users;`
    )
    .then((result) => {
      return result.rows;
    });
};
exports.removeComment = (id) => {
  return checkCommentId(id).then(() => {
      let queryStr =
        "DELETE FROM comments WHERE comment_id = $1 RETURNING *;";

      return db.query(queryStr, [id]).then((result) => { console.log(result)
        return result.rows;
      });
    });
  
};