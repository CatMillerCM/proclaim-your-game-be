const reviewsRouter = require("express").Router();
const { getReviewById } = require("../controllers/reviews-controller");

reviewsRouter.use("/:review_id", getReviewById);

module.exports = reviewsRouter;