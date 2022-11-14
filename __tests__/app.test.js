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

// describe("/api/reviews", () => {
//   test("GET 200: gets an array of review objects", () => {
//     return request(app)
//       .get("/api/reviews")
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.review.length).toBeGreaterThan(0);
//         body.review.forEach((review) => {
//           expect(review).toMatchObject({
//             description: expect.any(String),
//             category: expect.any(String),
//             review_img_url: expect.any(String),
//             created_at: expect.any(Date),
//             votes: expect.any(Number),
//             designer: expect.any(Number),
//             comment_count: expect.any(Number)
//           });
//         });
//       });
//   });
// });
