const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/categories", () => {
  test("GET 200: gets an array of category objects with slug and description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories.length).toBe(4);
        body.categories.forEach((category) => {
          expect(category).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  test("GET 404: when categories not correctly entered", () => {
    return request(app)
      .get("/api/categoris")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

describe("/api/reviews", () => {
  test("GET 200: gets an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => { 
        expect(body.reviews.length).toBeGreaterThan(0);
        body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET 200: gets an array of review objects sorted created_at desc by default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200: gets an array of review objects by category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBeGreaterThan(0);
        body.reviews.forEach((review) => {
          expect(review.category).toBe("dexterity");
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET 404: gets an error when category doesnt exist", () => {
    return request(app)
      .get("/api/reviews?category=dexterit")
      .expect(404)
      .then(({ body }) => { 
        expect(body.msg).toBe("no category matching entered category");
      })
    })

  test("GET 200: gets an array of review objects by category", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(0)
        })
      })

  test("GET 200: gets an array of review objects sorted by votes", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBeGreaterThan(0);
        expect(body.reviews).toBeSortedBy("votes", { descending: true });
      });
  });
  test("GET 400: gets error when given invalid sort", () => {
    return request(app)
      .get("/api/reviews?sort_by=INSERTDATA")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid sort query");
      });
  });
  test("GET 400: gets error when given invalid sort order", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=INSERTDATA")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid sort order");
      });
  });

  test("GET 200: gets an array of review objects sorted by owner ascending", () => {
    return request(app)
      .get("/api/reviews?sort_by=owner&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBeGreaterThan(0);
        expect(body.reviews).toBeSortedBy("owner", { ascending: true });
      });
  });

  test("GET 404: when reviews not correctly entered", () => {
    return request(app)
      .get("/api/reveisw")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});
describe("/api/reviews/:id", () => {
  test("GET 200: gets an array of review object", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => { 
        expect(body.reviews.length).toBe(1);
        expect(body.reviews[0].review_id).toBe(2);
        expect(body.reviews[0].comment_count).toBe(3);
        expect(body.reviews[0]).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          review_body: expect.any(String),
          votes: expect.any(Number),
          designer: expect.any(String),
          owner: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });
  test("GET 404: error when id does not exist", () => {
    return request(app)
      .get("/api/reviews/1900888")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("no review matching that id");
      });
  });

  test("GET 400: wrong data for id", () => {
    return request(app)
      .get("/api/reviews/daag")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("incorrect data type for id");
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  test("GET 200: gets an array of comments for review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => { 
        expect(body.comments.length).toBeGreaterThan(0);
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
        body.comments.forEach((comment, index) => {
          expect(body.comments[index].review_id).toBe(2);
          expect(comment).toMatchObject({
            author: expect.any(String),
            body: expect.any(String),
            votes: expect.any(Number),
            comment_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("GET 200: gets an blank array if no comments for review_id", () => {
    return request(app)
      .get("/api/reviews/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("GET 400: wrong data for id", () => {
    return request(app)
      .get("/api/reviews/daag/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("incorrect data type for id");
      });
  });
  test("GET 404: error when id does not exist", () => {
    return request(app)
      .get("/api/reviews/1900888/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("no review matching that id");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("POST 201: adding new comment to ID", () => { 
    const comment = {
      author: "bainesface",
      body: "I really loved this game too!",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => { 
        expect(body.comment[0].author).toBe("bainesface");
        expect(body.comment[0].body).toBe("I really loved this game too!");
        expect(body.comment[0]).toMatchObject({
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          review_id: expect.any(Number),
          votes: expect.any(Number),
          comment_id: expect.any(Number),
        });
      });
  });
  test("GET 404: error when id does not exist", () => {
    return request(app)
      .post("/api/reviews/1900888/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("no review matching that id");
      });
  });
  test("POST 400: failed to create comment as not enough data", () => {
    const comment = {
      author: "bainesface",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Insufficient data");
      });
  });
  test("POST 404: failed to create comment as user doesnt exist", () => {
    const comment = {
      author: "bainesface1",
      body: "I really loved this game too!",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("no user matching that username");
      });
  });
});
describe("PATCH /api/reviews/:review_id", () => {
  test("PATCH 200: increment vote", () => {
    const vote = { inc_vote: 5 };
    return request(app)
      .patch("/api/reviews/2")
      .send(vote)
      .expect(200)
      .then(({ body }) => { 
        expect(body.review[0].votes).toBe(10);
        expect(body.review[0]).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          review_body: expect.any(String),
          votes: expect.any(Number),
          designer: expect.any(String),
          owner: expect.any(String),
        });
      });
  });
  test("PATCH 200: decrement vote", () => {
    const vote = { inc_vote: -10 };
    return request(app)
      .patch("/api/reviews/2")
      .send(vote)
      .expect(200)
      .then(({ body }) => {
        expect(body.review[0].votes).toBe(-5);
        expect(body.review[0]).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          review_body: expect.any(String),
          votes: expect.any(Number),
          designer: expect.any(String),
          owner: expect.any(String),
        });
      });
  });
  test("PATCH 400: when wrong data", () => {
    const vote = { inc_vote: "adam" };
    return request(app)
      .patch("/api/reviews/2")
      .send(vote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request!");
      });
  });
  test(" 404: error when id does not exist", () => {
    const vote = { inc_vote: -10 };
    return request(app)
      .patch("/api/reviews/1900888")
      .send(vote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("no review matching that id");
      });
  });
  test("PATCH 400: wrong data for id", () => {
    const vote = { inc_vote: -10 };
    return request(app)
      .patch("/api/reviews/daag")
      .send(vote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("incorrect data type for id");
      });
  });
});
test("POST 400: failed to update vote as no vote sent", () => {
  const vote = {};
  return request(app)
    .patch("/api/reviews/2")
    .send(vote)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toEqual("Insufficient data");
    });
});
describe("/api/users", () => {
  test("GET 200: gets an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => { 
        expect(body.users.length).toBeGreaterThan(0);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            name: expect.any(String),
            username: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("GET 404: when users not correctly entered", () => {
    return request(app)
      .get("/api/use")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE 204: and removes comment with given ID from database", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204);
  });
  test("DELETE - 400: Invalid ID (wrong data type)", () => {
    return request(app)
      .delete("/api/comments/four")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request!");
      });
  });
  test("DELETE - 400: Invalid ID (wrong data type)", () => {
    return request(app)
      .delete("/api/comments/1001901")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("no comment matching given id");
      });
  });
})
describe("/api", () => {
  test("GET 200: gets endpoints json file", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({body}) => { 
        const output = {
          "GET /api": {
            "description": "serves up a json representation of all the available endpoints of the api"
          },
          "GET /api/categories": {
            "description": "serves an array of all categories",
            "queries": [],
            "exampleResponse": {
              "categories": [
                {
                  "description": "Players attempt to uncover each other's hidden role",
                  "slug": "Social deduction"
                }
              ]
            }
          },
          "GET /api/reviews": {
            "description": "serves an array of all reviews",
            "queries": ["category", "sort_by", "order"],
            "exampleResponse": {
              "reviews": [
                {
                  "title": "One Night Ultimate Werewolf",
                  "designer": "Akihisa Okui",
                  "owner": "happyamy2016",
                  "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                  "category": "hidden-roles",
                  "created_at": 1610964101251,
                  "review_id": 1,
                  "votes": 5,
                  "comment_count": 1
                }
              ]
            }
          },
          "GET /api/reviews/:id": {
            "description": "serves an array of all reviews by id",
            "queries": [],
            "exampleResponse": {
              "review": [
                {
                  "owner": "philippaclaire9",
                  "review_body": "Fiddly fun for all the family",
                  "title": "Jenga",
                  "review_id": 2,
                  "category": "dexterity",
                  "review_img_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                  "created_at": "2021-01-18T10:01:41.251Z",
                  "votes": 5,
                  "designer": "Leslie Scott",
                  "comment_count": 3
                }
              ]
            }
          },
          "GET /api/reviews/:id/comments:": {
            "description": "serves an array of comments from a review_id",
            "queries": [],
            "exampleResponse": {
              "review": [
                {
                  "comment_id": 5,
                  "votes": 13,
                  "created_at": "2021-01-18T10:24:05.410Z",
                  "body": "Now this is a story all about how, board games turned my life upside down",
                  "review_id": 2,
                  "author": "mallionaire"
                }
              ]
            }
          },
          "POST /api/reviews/:id/comments": {
            "description": "posts a comment and returns the posted comment",
            "queries": [],
            "exampleResponse": {
              "review": [
                {
                  "comment_id": 7,
                  "body": "I really loved this game too!",
                  "review_id": 2,
                  "author": "bainesface",
                  "votes": 0,
                  "created_at": "2022-11-18T11:57:37.390Z"
                }
              ]
            }
          },
          "PATCH /api/reviews/:review_id": {
            "description": "patch votes for a review by incrementing or decrementing and returns updated review",
            "queries": [],
            "exampleResponse": {
              "review": [
                {
                  "review_id": 2,
                  "title": "Jenga",
                  "category": "dexterity",
                  "designer": "Leslie Scott",
                  "owner": "philippaclaire9",
                  "review_body": "Fiddly fun for all the family",
                  "review_img_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                  "created_at": "2021-01-18T10:01:41.251Z",
                  "votes": 10
                }
              ]
            }
        },
        "GET /api/users": {
          "description": "serves an array of all users",
          "queries": [],
          "exampleResponse": {
            "categories": [
              {
                "name": "dave",
                "username": "dav3rid",
                "avatar_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
              }
            ]
          }
        },
        "DELETE /api/comments/:comment_id": {
          "description": "deletes a user with given id",
          "queries": [],
          "exampleResponse": {
            "categories": [
              
            ]
          }
        }
        }
        expect(body.data).toEqual(output)
      })
    })
    test("GET 404: when api not correctly entered", () => {
      return request(app)
        .get("/ap")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("path not found");
        });
    });
  });
  