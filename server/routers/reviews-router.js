const reviewsRouter = require("express").Router();
const { handlesMethodNotAllowedError } = require("../controllers/error-controller");
const { getReviews, getReviewById, patchReviewVotes } = require("../controllers/reviews-controller");
const { getCommentsByReview, postComment } = require("../controllers/comments-controller");

reviewsRouter.route("/:review_id/comments").get(getCommentsByReview).post(postComment).all(handlesMethodNotAllowedError);
reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReviewVotes).all(handlesMethodNotAllowedError);
reviewsRouter.route("/").get(getReviews).all(handlesMethodNotAllowedError);

module.exports = reviewsRouter;