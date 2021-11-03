const reviewsRouter = require("express").Router();
//const reviewIdRouter = require("./review-id-router");
// const commentsRouter = require("./comments-router");
const { getReviews, getReviewById, patchReviewVotes, getCommentsByReview } = require("../controllers/reviews-controller");

// reviewsRouter.use("/:review_id", reviewIdRouter);
reviewsRouter.get("/:review_id/comments", getCommentsByReview);
reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReviewVotes);
reviewsRouter.get("/", getReviews);

module.exports = reviewsRouter;