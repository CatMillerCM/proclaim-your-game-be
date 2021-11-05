const { selectReviewById, updateReviewVotes, selectReviews, selectCommentsByReview, createComment} = require("../models/reviews-model");

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    selectReviewById(review_id)
    .then((review) => {
        res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewVotes = (req, res, next) => {
    const { review_id } = req.params;
    const update = req.body;
    updateReviewVotes(review_id, update)
    .then((review) => {
        res.status(201).send({review});
    })
    .catch(next);
}

exports.getReviews = (req, res, next) => {
    const { sort_by } = req.query;
    const { order } = req.query;
    const { category } = req.query;
    selectReviews(sort_by, order, category)
    .then((reviews) => {
        res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getCommentsByReview = (req, res, next) => {
    const { review_id } = req.params;
    selectCommentsByReview(review_id)
    .then((comments) => {
        res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
    const { review_id } = req.params;
    const commentObj = req.body;
    createComment(review_id, commentObj)
    .then((comment) => {
        res.status(201).send({ comment });
    })
    .catch(next);
}