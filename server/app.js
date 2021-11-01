const app = require("express")();
const { notARoute, psqlErrors, customErrors, serverErrors } = require("./controllers/error-controller.js");
const apiRouter = require("./routers/api-router.js");

//ROUTERS
app.use("/api", apiRouter);


//ERROR HANDLING
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found." });
});

app.use(notARoute);
app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);


module.exports = app;
