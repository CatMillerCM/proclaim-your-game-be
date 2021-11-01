const db = require('../db/index.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../server/app');
const request = require('supertest');


beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("app", () => {
    test("Status: 404. Responds with an error message when the path does not exist", () => {
        return request(app)
            .get("/api/not-a-path")
            .expect(404)
            .then(({ body }) => {
            expect(body.msg).toBe("Path not found.");
        });
    });
});

describe("/api/categories", () => {
    describe("GET", () => {
        test("Status: 200. Responds with an array of category objects", () => {
            return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({ body }) => {
                const { categories } = body;
                expect(categories).toBeInstanceOf(Array);
                expect(categories.length).toBe(4);
                categories.forEach((categoryObj) => {
                    expect(categoryObj).toEqual(expect.objectContaining({
                        category_description: expect.any(String),
                        category_slug: expect.any(String)
                    }));
                });
            });
        });
    });
});

describe("/api/reviews/:review_id", () => {
    describe("GET", () => {
        test("Status: 200. Responds with a review object with the relevant properties", () => {
            return request(app)
            .get("/api/reviews/2")
            .expect(200)
            .then(({ body }) => {
                const { review } = body;
                expect(review).toBeInstanceOf(Object);
                expect(Object.keys(review).length).toBe(10);
                expect(review.comment_count).toBe("3");
            });
        });
        test("Status: 404. Responds with an error message when the path is logical but does not exist", () => {
            return request(app)
            .get("/api/reviews/9999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Review not found.");
            });
        });
        test("Status: 400. Responds with an error message when the path is illogical", () => {
            return request(app)
            .get("/api/reviews/not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid data entry.");
            });
        });
    });
    describe("PATCH", () => {
        test("Status: 201. Responds with a review object with the vote property updated by the input value", () => {
            const voteUpdate = { inc_votes: 5 };
            return request(app)
            .patch("/api/reviews/2")
            .send(voteUpdate)
            .expect(201)
            .then(({ body }) => {
                const { review } = body;
                expect(review).toBeInstanceOf(Object);
                expect(Object.keys(review).length).toBe(9);
                expect(review.review_votes).toBe(10);
            });
        });
        test("Status: 404. Responds with an error message when the path is logical but does not exist", () => {
            const voteUpdate = { inc_votes: 5 };
            return request(app)
            .patch("/api/reviews/9999")
            .send(voteUpdate)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Review not found.");
            });
        });
        test("Status: 400. Responds with an error message when the path is illogical", () => {
            const voteUpdate = { inc_votes: 5 };
            return request(app)
            .patch("/api/reviews/not-a-number")
            .send(voteUpdate)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid data entry.");
            });
        });
        test("Status: 400. Responds with an error message when the patch request is an empty object", () => {
            const voteUpdate = {};
            return request(app)
            .patch("/api/reviews/2")
            .send(voteUpdate)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid patch object.");
            });
        });
        test("Status: 400. Responds with an error message when the patch request is of the wrong input type", () => {
            const voteUpdate = { inc_votes: "five"};
            return request(app)
            .patch("/api/reviews/2")
            .send(voteUpdate)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid patch object.");
            });
        });
    });
});
