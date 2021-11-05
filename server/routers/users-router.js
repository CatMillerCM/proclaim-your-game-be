const usersRouter = require("express").Router();
const { handlesMethodNotAllowedError } = require("../controllers/error-controller");
const { getUsers, getUserByUsername } = require("../controllers/users-controller");

usersRouter.route("/").get(getUsers).all(handlesMethodNotAllowedError);
usersRouter.route("/:username").get(getUserByUsername).all(handlesMethodNotAllowedError);

module.exports = usersRouter;