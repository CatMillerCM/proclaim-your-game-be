const reviewsRouter = require("express").Router();
const { getReviewById, patchReviewVotes, getReviews } = require("../controllers/reviews-controller");

reviewsRouter.get("/", getReviews);
reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReviewVotes);

module.exports = reviewsRouter;