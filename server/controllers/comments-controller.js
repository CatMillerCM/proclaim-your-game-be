const { selectComments, removeComments } = require("../models/comments-model");

exports.getComments = (req, res, next) => {
    selectComments()
    .then((comments) => {
        res.status(200).send({ comments });
    })
    .catch(next);
};

exports.deleteComments = (req, res, next) => {
    const { comment_id } = req.params;
    removeComments(comment_id)
    .then(() => {
        res.status(204).send();
    })
    .catch(next);
};