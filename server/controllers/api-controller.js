exports.getApi = (req, res) => {
	res.status(200).send({ msg: `Welcome to this API! The available endpoints are: GET /api/categories, GET /api/reviews/:review_id, PATCH /api/reviews/:review_id, GET /api/reviews, GET /api/reviews/:review_id/comments, POST /api/reviews/:review_id/comments, DELETE /api/comments/:comment_id, GET /api` });
};