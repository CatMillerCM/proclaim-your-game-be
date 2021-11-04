const { selectComments, removeComments, updateCommentVotes } = require("../models/comments-model");

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

exports.patchCommentVotes = (req, res, next) => {
    const { comment_id } = req.params;
    const update = req.body;
    updateCommentVotes(comment_id, update)
    .then(( comment ) => {
        res.status(201).send({ comment });
    })
    .catch(next);
};