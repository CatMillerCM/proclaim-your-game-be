const apiRouter = require("express").Router();
const { getApi } = require("../controllers/api-controller");
const { handlesMethodNotAllowedError } = require("../controllers/error-controller");
const categoriesRouter = require("./categories-router");
const reviewsRouter = require("./reviews-router");
const commentsRouter = require("./comments-router");
const usersRouter = require("./users-router");

apiRouter.route("/").get(getApi).all(handlesMethodNotAllowedError);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;