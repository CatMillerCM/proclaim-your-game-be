const commentsRouter = require("express").Router();
const { getComments, deleteComments } = require("../controllers/comments-controller");

commentsRouter.get("/", getComments);
commentsRouter.delete("/:comment_id", deleteComments);

module.exports = commentsRouter;