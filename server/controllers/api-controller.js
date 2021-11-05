const endpoints = require("../../utils/endpoints.json")

exports.getApi = (req, res) => {
	res.status(200).send(endpoints);
};