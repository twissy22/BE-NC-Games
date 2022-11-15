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
        expect(body.categories.length).toBeGreaterThan(0);
        body.categories.forEach((category) => {
          expect(category).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  test("GET 404: when categories not correctly entered", ()=> {
    return request(app)
      .get("/api/categoris")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
  })
})
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
  test("GET 200: gets an array of review objects sorted desc", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at",{descending:true});
      })
    })
    test("GET 404: when reviews not correctly entered", ()=> {
      return request(app)
        .get("/api/reveisw")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("path not found");
    })
  })
});
describe("/api/reviews/:id", () => {
  test("GET 200: gets an array of review object", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(1)
        expect(body.reviews[0].review_id).toBe(1)
          expect(body.reviews[0]).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            review_body: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            owner: expect.any(String)
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
          expect(body.msg).toBe("bad request!");
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
        expect(body.comments[0].review_id).toBe(2)
      });
  });
  test("GET 200: gets an blank array if comments for review_id", () => {
    return request(app)
      .get("/api/reviews/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([])
      });
    })
  test("GET 400: wrong data for id", () => {
    return request(app)
      .get("/api/reviews/daag/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request!");
      });
  
      });
  test("GET 404: error when id does not exist", () => {
    return request(app)
      .get("/api/reviews/1900888/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("no reviewer matching that id");
      });
  
      });
 })
