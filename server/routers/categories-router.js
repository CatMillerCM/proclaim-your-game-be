const categoriesRouter = require("express").Router();
const { getCategories } = require("../controllers/categories-controller");

categoriesRouter.use("/", getCategories);

module.exports = categoriesRouter;