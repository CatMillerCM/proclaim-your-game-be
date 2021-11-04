const commentsRouter = require("express").Router();
const { getComments, deleteComments, patchCommentVotes } = require("../controllers/comments-controller");

commentsRouter.get("/", getComments);
commentsRouter.route("/:comment_id").delete(deleteComments).patch(patchCommentVotes);

module.exports = commentsRouter;