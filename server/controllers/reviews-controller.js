const { selectReviewById, updateReviewVotes } = require("../models/reviews-model");

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
    const { inc_votes } = req.body;
    updateReviewVotes(review_id, inc_votes)
    .then((review) => {
        res.status(201).send({review});
    })
    .catch(next);
}
