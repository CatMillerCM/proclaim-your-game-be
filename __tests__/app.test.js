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

describe("/api", () => {
    describe("GET", () => {
        test("Status: 200. Responds with JSON describing all the available endpoints on the API", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(Object.keys(body["Welcome to this API!"]["Here are the available endpoints:"]).length).toBe(12);
            });
        });
    });
    describe("PATCH", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .patch("/api")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("PUT", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .put("/api")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("POST", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .post("/api")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("DELETE", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .delete("/api")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
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
                        description: expect.any(String),
                        slug: expect.any(String)
                    }));
                });
            });
        });
    });
    describe("PATCH", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .patch("/api/categories")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("PUT", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .put("/api/categories")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("POST", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .post("/api/categories")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("DELETE", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .delete("/api/categories")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
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
                expect(review.comment_count).toBe(3);
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
        test("Status: 200. Responds with a review object with the vote property incremented when the input value is positive", () => {
            const voteUpdate = { inc_votes: 5 };
            return request(app)
            .patch("/api/reviews/2")
            .send(voteUpdate)
            .expect(200)
            .then(({ body }) => {
                const { review } = body;
                expect(review).toBeInstanceOf(Object);
                expect(Object.keys(review).length).toBe(9);
                expect(review.votes).toBe(10);
            });
        });
        test("Status: 200. Responds with a review object with the vote property decremented when the input value is negative", () => {
            const voteUpdate = { inc_votes: -2 };
            return request(app)
            .patch("/api/reviews/2")
            .send(voteUpdate)
            .expect(200)
            .then(({ body }) => {
                const { review } = body;
                expect(review).toBeInstanceOf(Object);
                expect(Object.keys(review).length).toBe(9);
                expect(review.votes).toBe(3);
            });
        });
        test("Status: 200. Responds with an unchanged review object when the patch request is an empty object", () => {
            const voteUpdate = {};
            return request(app)
            .patch("/api/reviews/2")
            .send(voteUpdate)
            .expect(200)
            .then(({ body }) => {
                const { review } = body;
                expect(review).toBeInstanceOf(Object);
                expect(Object.keys(review).length).toBe(9);
                expect(review.votes).toBe(5);
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
        test("Status: 422. Responds with an error message when the patch request has another property on the body", () => {
            const voteUpdate = { inc_votes: 1, name: "Mitch"};
            return request(app)
            .patch("/api/reviews/2")
            .send(voteUpdate)
            .expect(422)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid patch object.");
            });
        });
    });
    describe("PUT", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .put("/api/reviews/2")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("POST", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .post("/api/reviews/2")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("DELETE", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .delete("/api/reviews/2")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
});

describe("/api/reviews", () => {
    describe("GET", () => {
        test("Status: 200. Responds with an array of 10 review objects by default", () => {
            return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeInstanceOf(Array);
                expect(reviews.length).toBe(10);
                reviews.forEach((reviewObj) => {
                    expect(reviewObj).toBeInstanceOf(Object);
                    expect(Object.keys(reviewObj).length).toBe(8);
                    expect(reviewObj.hasOwnProperty("comment_count")).toBe(true);
                });
            });
        });
        test("Status: 200. Responds with an array of 5 review objects when specified in the query", () => {
            return request(app)
            .get("/api/reviews?limit=5")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeInstanceOf(Array);
                expect(reviews.length).toBe(5);
                reviews.forEach((reviewObj) => {
                    expect(reviewObj).toBeInstanceOf(Object);
                    expect(Object.keys(reviewObj).length).toBe(8);
                    expect(reviewObj.hasOwnProperty("comment_count")).toBe(true);
                });
            });
        });
        test("Status: 200. Responds with an array of review objects sorted by review creation date descending by default", () => {
            return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(body.reviews).toBeSortedBy("created_at", { descending: true });
            });
        });
        test("Status: 200. Responds with an array of review objects sorted by review creation date descending when input as a valid query", () => {
            return request(app)
            .get("/api/reviews?sort_by=created_at")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy("created_at", { descending: true });
            });
        });
        test("Status: 200. Responds with an array of review objects sorted by game owner username descending when input as a valid query", () => {
            return request(app)
            .get("/api/reviews?sort_by=owner")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy("owner", { descending: true });
            });
        });
        test("Status: 200. Responds with an array of review objects sorted by review id descending when input as a valid query", () => {
            return request(app)
            .get("/api/reviews?sort_by=review_id")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy("review_id", { descending: true });
            });
        });
        test("Status: 200. Responds with an array of review objects sorted by review game category descending when input as a valid query", () => {
            return request(app)
            .get("/api/reviews?sort_by=category")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy("category", { descending: true });
            });
        });
        test("Status: 200. Responds with an array of review objects sorted by comment count descending when input as a valid query", () => {
            return request(app)
            .get("/api/reviews?sort_by=comment_count")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy("comment_count", { descending: true });
            });
        });
        test("Status: 400. Responds with an error message when the limit query is invalid (over 10)", () => {
            return request(app)
            .get("/api/reviews?limit=20")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Limit query exceeds maximum of 10.");
            });
        });
        test("Status: 400. Responds with an error message when the limit query is invalid (under 0)", () => {
            return request(app)
            .get("/api/reviews?limit=-4")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid limit query.");
            });
        });
        test("Status: 400. Responds with an error message when the limit query is of an incorrect data type", () => {
            return request(app)
            .get("/api/reviews?limit=not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid limit query.");
            });
        });
        test("Status: 400. Responds with an error message when the sort_by query is invalid", () => {
            return request(app)
            .get("/api/reviews?sort_by=invalid_query")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid sort_by query.");
            });
        });
        test("Status: 400. Responds with an error message when the sort_by query is of an incorrect data type", () => {
            return request(app)
            .get("/api/reviews?sort_by=123")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid sort_by query.");
            });
        });
        test("Status: 200. Responds with an array of review objects sorted by review creation date by default but specified in ascending order", () => {
            return request(app)
            .get("/api/reviews?order=asc")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(body.reviews).toBeSortedBy("created_at");
            });
        });
        test("Status: 200. Responds with an array of review objects sorted by review image url ascending when sort_by and order queries are valid", () => {
            return request(app)
            .get("/api/reviews?sort_by=review_img_url&order=asc")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy("review_img_url");
            });
        });
        test("Status: 200. Responds with an array of review objects sorted by review votes ascending when sort_by and order queries are valid", () => {
            return request(app)
            .get("/api/reviews?sort_by=votes&order=asc")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy("votes");
            });
        });
        test("Status: 200. Responds with an array of review objects sorted by review title descending when sort_by and order queries are valid", () => {
            return request(app)
            .get("/api/reviews?sort_by=title&order=desc")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy("title", { descending: true });
            });
        });
        test("Status: 400. Responds with an error message when the order query is invalid", () => {
            return request(app)
            .get("/api/reviews?order=invalid_query")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid order query.");
            });
        });
        test("Status: 400. Responds with an error message when the order query is of an incorrect data type", () => {
            return request(app)
            .get("/api/reviews?sort_by=review_id&order=123")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid order query.");
            });
        });
        test("Status: 200. Responds with an array of review objects that are relevant to the queried category with a default limit of 10 starting at page 1 by default", () => {
            return request(app)
            .get("/api/reviews?category=social deduction")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeInstanceOf(Array);
                expect(reviews.length).toBe(10);
                reviews.forEach((reviewObj) => {
                    expect(reviewObj.category).toBe("social deduction");
                });
            });
        });
        test("Status: 200. Responds with an array of review objects that are relevant to the queried category with a default limit of 10 starting at page 2", () => {
            return request(app)
            .get("/api/reviews?p=2&category=social deduction")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeInstanceOf(Array);
                expect(reviews.length).toBe(1);
                reviews.forEach((reviewObj) => {
                    expect(reviewObj.category).toBe("social deduction");
                });
                expect(reviews[0].title).toBe("Settlers of Catan: Don't Settle For Less")
            });
        });
        test("Status: 200. Responds with an array of review objects that are relevant to the queried category with a limit of 3 starting at page 1 by default", () => {
            return request(app)
            .get("/api/reviews?category=social deduction&limit=3")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeInstanceOf(Array);
                expect(reviews.length).toBe(3);
                reviews.forEach((reviewObj) => {
                    expect(reviewObj.category).toBe("social deduction");
                });
            });
        });
        test("Status: 200. Responds with an array of review objects that are relevant to the queried category with a limit of 3 starting at page 3", () => {
            return request(app)
            .get("/api/reviews?p=3&category=social deduction&limit=3")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeInstanceOf(Array);
                expect(reviews.length).toBe(3);
                reviews.forEach((reviewObj) => {
                    expect(reviewObj.category).toBe("social deduction");
                });
                expect(reviews[0].title).toBe('That\'s just what an evil person would say!')
            });
        });
        test("Status: 404. Responds with an error message when the page query is logical but does not exist", () => {
            return request(app)
            .get("/api/reviews?p=999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Page number not found.");
            });
        });
        test("Status: 400. Responds with an error message when the page query is invalid (under 0)", () => {
            return request(app)
            .get("/api/reviews?p=-10")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid page query.");
            });
        });
        test("Status: 400. Responds with an error message when the page query is of an incorrect data type", () => {
            return request(app)
            .get("/api/reviews?p=not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid page query.");
            });
        });
        test("Status: 404. Responds with an error message when the category query is not in the database", () => {
            return request(app)
            .get("/api/reviews?category=not_a_category")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Non-existent category.");
            });
        });
        test("Status: 200. Responds with an empty array when the category exists but contains no reviews", () => {
            return request(app)
            .get("/api/reviews?category=children's games")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toEqual([]);
            });
        });
        test("Status: 200. Responds with an array of 10 review objects by default, and has a total count property", () => {
            return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeInstanceOf(Array);
                const { total_count } = body;
                expect(total_count).toBe(13);
            });
        });
        test("Status: 200. Responds with an array of review objects that are relevant to the queried category with a limit of 3 starting at page 3, and has a total count property", () => {
            return request(app)
            .get("/api/reviews?p=3&category=social deduction&limit=3")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeInstanceOf(Array);
                const { total_count } = body;
                expect(total_count).toBe(11);
            });
        });
    });
    describe("PATCH", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .patch("/api/reviews")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("PUT", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .put("/api/reviews")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("POST", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .post("/api/reviews")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("DELETE", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .delete("/api/reviews")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
});

describe("/api/reviews/:review_id/comments", () => {
    describe("GET", () => {
        test("Status: 200. Responds with an array of comments for the given review id with the relevant properties", () => {
            return request(app)
            .get("/api/reviews/2/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toBeInstanceOf(Array);
                expect(comments.length).toBe(3);
                comments.forEach((commentObj) => {
                    expect(commentObj).toBeInstanceOf(Object);
                    expect(Object.keys(commentObj).length).toBe(5);
                });
            });
        });
        test("Status: 200. Responds with an array of 2 comment objects when specified in the query", () => {
            return request(app)
            .get("/api/reviews/2/comments?limit=2")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toBeInstanceOf(Array);
                expect(comments.length).toBe(2);
                comments.forEach((commentObj) => {
                    expect(commentObj).toBeInstanceOf(Object);
                    expect(Object.keys(commentObj).length).toBe(5);
                });
            });
        });
        test("Status: 400. Responds with an error message when the limit query is invalid (over 10)", () => {
            return request(app)
            .get("/api/reviews/2/comments?limit=20")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Limit query exceeds maximum of 10.");
            });
        });
        test("Status: 400. Responds with an error message when the limit query is invalid (under 0)", () => {
            return request(app)
            .get("/api/reviews/2/comments?limit=-4")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid limit query.");
            });
        });
        test("Status: 400. Responds with an error message when the limit query is of an incorrect data type", () => {
            return request(app)
            .get("/api/reviews/2/comments?limit=not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid limit query.");
            });
        });
        test("Status: 404. Responds with an error message when the review id is logical but does not exist", () => {
            return request(app)
            .get("/api/reviews/9999/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Review not found.");
            });
        });
        test("Status: 400. Responds with an error message when the review id is illogical", () => {
            return request(app)
            .get("/api/reviews/not-a-number/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid data entry.");
            });
        });
        test("Status: 200. Responds with an empty array when the review id exists but has no associated comments", () => {
            return request(app)
            .get("/api/reviews/1/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([]);
            });
        });
    });
    describe("POST", () => {
        test("Status: 201. Responds with a comment object with the relevant properties", () => {
            const newComment = {author: 'philippaclaire9', body: 'Great fun for the fam!'}
            return request(app)
            .post("/api/reviews/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body;
                expect(comment).toBeInstanceOf(Object);
                expect(Object.keys(comment).length).toBe(6);
                expect(comment.author).toEqual('philippaclaire9');
                expect(comment.body).toEqual('Great fun for the fam!')
            });
        });
        test("Status: 201. Responds with a comment object with the relevant properties, ignoring unnecessary properties", () => {
            const newComment = {author: 'philippaclaire9', body: 'Great fun for the fam!', votes: 8}
            return request(app)
            .post("/api/reviews/2/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body;
                expect(comment).toBeInstanceOf(Object);
                expect(Object.keys(comment).length).toBe(6);
                expect(comment.author).toEqual('philippaclaire9');
                expect(comment.body).toEqual('Great fun for the fam!')
            });
        });
        test("Status: 404. Responds with an error message when the review id is logical but does not exist", () => {
            const newComment = {author: 'philippaclaire9', body: 'Great fun for the fam!'}
            return request(app)
            .post("/api/reviews/9999/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Review not found.");
            });
        });
        test("Status: 400. Responds with an error message when the review id is illogical", () => {
            const newComment = {author: 'philippaclaire9', body: 'Great fun for the fam!'}
            return request(app)
            .post("/api/reviews/not-a-number/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid data entry.");
            });
        });
        test("Status: 400. Responds with an error message when the comment post request is an empty object", () => {
            const newComment = {};
            return request(app)
            .post("/api/reviews/2/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid post object.");
            });
        });
        test("Status: 400. Responds with an error message when the post request contains the wrong body data type", () => {
            const newComment = {author: 'philippaclaire9', body: 5};
            return request(app)
            .post("/api/reviews/2/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid post object.");
            });
        });
        test("Status: 400. Responds with an error message when the post request contains the wrong author data type", () => {
            const newComment = {author: 15, body: 'Great fun for the fam!'}
            return request(app)
            .post("/api/reviews/2/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid post object.");
            });
        });
        test("Status: 404. Responds with an error message when the post request specifies a username that does not exist", () => {
            const newComment = {author: 'user-does-not-exist', body: 'Great fun for the fam!'}
            return request(app)
            .post("/api/reviews/2/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid username.");
            });
        });
        test("Status: 400. Responds with an error message when the post request does not have both properties", () => {
            const newComment = {author: 'philippaclaire9'}
            return request(app)
            .post("/api/reviews/2/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid post object.");
            });
        });
        test("Status: 404. Responds with an error message when the page query is logical but does not exist", () => {
            return request(app)
            .get("/api/reviews/2/comments?p=999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Page number not found.");
            });
        });
        test("Status: 400. Responds with an error message when the page query is invalid (under 0)", () => {
            return request(app)
            .get("/api/reviews/2/comments?p=-10")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid page query.");
            });
        });
        test("Status: 400. Responds with an error message when the page query is of an incorrect data type", () => {
            return request(app)
            .get("/api/reviews/2/comments?p=not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid page query.");
            });
        });
    });
    describe("PATCH", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .patch("/api/reviews/2/comments")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("PUT", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .put("/api/reviews/2/comments")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("DELETE", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .delete("/api/reviews/2/comments")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
});

describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
        test("Status: 204. Deletes the relevant comment and does not send any content back", () => {
            return request(app)
            .delete("/api/comments/2")
            .expect(204)
            .then(() => {
                return request(app)
                .get("/api/comments").expect(200)
            })
            .then(({ body }) => {
                const { comments } = body;
                expect(comments.length).toBe(5)
            })
        });
        test("Status: 404. Responds with an error message when the path is logical but does not exist", () => {
            return request(app)
            .delete("/api/comments/9999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Comment not found.");
            });
        });
        test("Status: 400. Responds with an error message when the path is illogical", () => {
            return request(app)
            .delete("/api/comments/not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid data entry.");
            });
        });
    });
    describe("PATCH", () => {
        test("Status: 200. Responds with a comment object with the vote property incremented when the input value is positive", () => {
            const voteUpdate = { inc_votes: 4 };
            return request(app)
            .patch("/api/comments/3")
            .send(voteUpdate)
            .expect(200)
            .then(({ body }) => {
                const { comment } = body;
                expect(comment).toBeInstanceOf(Object);
                expect(Object.keys(comment).length).toBe(6);
                expect(comment.votes).toBe(14);
            });
        });
        test("Status: 200. Responds with a comment object with the vote property decremented when the input value is negative", () => {
            const voteUpdate = { inc_votes: -2 };
            return request(app)
            .patch("/api/comments/3")
            .send(voteUpdate)
            .expect(200)
            .then(({ body }) => {
                const { comment } = body;
                expect(comment).toBeInstanceOf(Object);
                expect(Object.keys(comment).length).toBe(6);
                expect(comment.votes).toBe(8);
            });
        });
        test("Status: 200. Responds with an unchanged comment object when the patch request is an empty object", () => {
            const voteUpdate = {};
            return request(app)
            .patch("/api/comments/3")
            .send(voteUpdate)
            .expect(200)
            .then(({ body }) => {
                const { comment } = body;
                expect(comment).toBeInstanceOf(Object);
                expect(Object.keys(comment).length).toBe(6);
                expect(comment.votes).toBe(10);
            });
        });
        test("Status: 404. Responds with an error message when the path is logical but does not exist", () => {
            const voteUpdate = { inc_votes: 5 };
            return request(app)
            .patch("/api/comments/9999")
            .send(voteUpdate)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Comment not found.");
            });
        });
        test("Status: 400. Responds with an error message when the path is illogical", () => {
            const voteUpdate = { inc_votes: 5 };
            return request(app)
            .patch("/api/comments/not-a-number")
            .send(voteUpdate)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid data entry.");
            });
        });
        test("Status: 400. Responds with an error message when the patch request is of the wrong input type", () => {
            const voteUpdate = { inc_votes: "five"};
            return request(app)
            .patch("/api/comments/2")
            .send(voteUpdate)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid patch object.");
            });
        });
        test("Status: 422. Responds with an error message when the patch request has another property on the body", () => {
            const voteUpdate = { inc_votes: 1, name: "Mitch"};
            return request(app)
            .patch("/api/comments/2")
            .send(voteUpdate)
            .expect(422)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid patch object.");
            });
        });
    });
    describe("GET", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .get("/api/comments/2")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("PUT", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .put("/api/comments/2")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("POST", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .post("/api/comments/2")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
});

describe("/api/users", () => {
    describe("GET", () => {
        test("Status: 200. Responds with an array of users' usernames", () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                const { users } = body;
                expect(users).toBeInstanceOf(Array);
                expect(users.length).toBe(4);
                users.forEach((userObj) => {
                    expect(userObj).toEqual(expect.objectContaining({
                        username: expect.any(String)
                    }));
                });
            });
        });
    });
    describe("PATCH", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .patch("/api/users")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("PUT", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .put("/api/users")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("POST", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .post("/api/users")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("DELETE", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .delete("/api/users")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
});

describe("/api/users/:username", () => {
    describe("GET", () => {
        test("Status: 200. Responds with a user object with the relevant properties", () => {
            return request(app)
            .get("/api/users/mallionaire")
            .expect(200)
            .then(({ body }) => {
                const { user } = body;
                expect(user).toBeInstanceOf(Object);
                expect(Object.keys(user).length).toBe(3);
                expect(user).toEqual({
                    username: 'mallionaire',
                    name: 'haz',
                    avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                });
            });
        });
        test("Status: 404. Responds with an error message when the username does not exist", () => {
            return request(app)
            .get("/api/users/undefined-username")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Username not found.");
            });
        });
    });
    describe("PATCH", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .patch("/api/users/mallionaire")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("PUT", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .put("/api/users/mallionaire")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("POST", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .post("/api/users/mallionaire")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
    describe("DELETE", () => {
        test("Status: 405. Responds with an error message when the path is not allowed", () => {
            return request(app)
            .delete("/api/users/mallionaire")
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe("Method not allowed.");
            });
        });
    });
});