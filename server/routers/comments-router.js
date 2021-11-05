const commentsRouter = require("express").Router();
const { handlesMethodNotAllowedError } = require("../controllers/error-controller");
const { getComments, deleteComments, patchCommentVotes } = require("../controllers/comments-controller");

commentsRouter.route("/").get(getComments).all(handlesMethodNotAllowedError);
commentsRouter.route("/:comment_id").delete(deleteComments).patch(patchCommentVotes).all(handlesMethodNotAllowedError);

module.exports = commentsRouter;