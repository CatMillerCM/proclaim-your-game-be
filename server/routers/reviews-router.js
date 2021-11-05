const reviewsRouter = require("express").Router();
const { getReviews, getReviewById, patchReviewVotes } = require("../controllers/reviews-controller");
const { getCommentsByReview, postComment } = require("../controllers/comments-controller");

reviewsRouter.route("/:review_id/comments").get(getCommentsByReview).post(postComment);
reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReviewVotes);
reviewsRouter.get("/", getReviews);

module.exports = reviewsRouter;