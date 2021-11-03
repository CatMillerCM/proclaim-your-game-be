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
});

describe("/api/reviews", () => {
    describe("GET", () => {
        test("Status: 200. Responds with an array of review objects", () => {
            return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeInstanceOf(Array);
                expect(reviews.length).toBe(13);
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
                expect(body.reviews).toBeSortedBy("review_created_at", { descending: true });
            });
        });
        test("Status: 200. Responds with an array of review objects sorted by review creation date descending when input as a valid query", () => {
            return request(app)
            .get("/api/reviews?sort_by=review_created_at")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy("review_created_at", { descending: true });
            });
        });
        test("Status: 200. Responds with an array of review objects sorted by game owner username descending when input as a valid query", () => {
            return request(app)
            .get("/api/reviews?sort_by=game_owner")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy("game_owner", { descending: true });
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
            .get("/api/reviews?sort_by=game_category")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy("game_category", { descending: true });
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
                expect(body.reviews).toBeSortedBy("review_created_at");
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
            .get("/api/reviews?sort_by=review_votes&order=asc")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy("review_votes");
            });
        });
        test("Status: 200. Responds with an array of review objects sorted by review title descending when sort_by and order queries are valid", () => {
            return request(app)
            .get("/api/reviews?sort_by=review_title&order=desc")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy("review_title", { descending: true });
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
        test("Status: 200. Responds with an array of review objects that are relevant to the queried category", () => {
            return request(app)
            .get("/api/reviews?game_category=social deduction")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeInstanceOf(Array);
                expect(reviews.length).toBe(11);
                reviews.forEach((reviewObj) => {
                    expect(reviewObj.game_category).toBe("social deduction");
                });
            });
        });
        test("Status: 400. Responds with an error message when the category query is not in the database", () => {
            return request(app)
            .get("/api/reviews?game_category=not_a_category")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("No games match this category");
            });
        });
        test("Status: 200. Responds with an empty array when the category exists but contains no reviews", () => {
            return request(app)
            .get("/api/reviews?game_category=children's games")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toEqual([]);
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
            .post("/api/reviews/2/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body;
                expect(comment).toBeInstanceOf(Object);
                expect(Object.keys(comment).length).toBe(6);
                expect(comment.comment_author).toEqual('philippaclaire9');
                expect(comment.comment_body).toEqual('Great fun for the fam!')
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
        test("Status: 400. Responds with an error message when the post request specifies a username that does not exist", () => {
            const newComment = {author: 'user-does-not-exist', body: 'Great fun for the fam!'}
            return request(app)
            .post("/api/reviews/2/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid username.");
            });
        });
        test("Status: 422. Responds with an error message when the post request has another property", () => {
            const newComment = {author: 'philippaclaire9', body: 'Great fun for the fam!', votes: 8}
            return request(app)
            .post("/api/reviews/2/comments")
            .send(newComment)
            .expect(422)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid post object.");
            });
        });
        test("Status: 422. Responds with an error message when the post request does not have both properties", () => {
            const newComment = {author: 'philippaclaire9'}
            return request(app)
            .post("/api/reviews/2/comments")
            .send(newComment)
            .expect(422)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid post object.");
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
});