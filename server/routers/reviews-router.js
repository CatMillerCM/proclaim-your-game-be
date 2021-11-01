const reviewsRouter = require("express").Router();
const { getReviewById, patchReviewVotes } = require("../controllers/reviews-controller");

reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReviewVotes);

module.exports = reviewsRouter;