const categoriesRouter = require("express").Router();
const { handlesMethodNotAllowedError } = require("../controllers/error-controller");
const { getCategories } = require("../controllers/categories-controller");

categoriesRouter.route("/").get(getCategories).all(handlesMethodNotAllowedError);

module.exports = categoriesRouter;