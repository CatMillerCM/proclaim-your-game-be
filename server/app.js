const express = require("express");
const { handleInvalidRoute, handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./controllers/error-controller.js");
const apiRouter = require("./routers/api-router.js");

const app = express();
app.use(express.json());

//ROUTERS
app.use("/api", apiRouter);


//ERROR HANDLING
app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Path not found." });
});

app.use(handleInvalidRoute);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app;
