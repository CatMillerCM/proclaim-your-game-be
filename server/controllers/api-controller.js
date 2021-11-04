exports.getApi = (req, res) => {
	res.status(200).send({
		"Welcome to this API!": {
			"Here are the available endpoints:": {
				"GET /api": {
					"description": "serves up a json representation of all the available endpoints of the api"
				},
				"GET /api/categories": {
					"description": "serves an array of all categories",
					"queries": [],
					"exampleResponse": {
						"categories": [
							{
							"category_description": "Players attempt to uncover each other's hidden role",
							"category_slug": "Social deduction"
							}
						]
					}
				},
				"GET /api/reviews": {
					"description": "serves an array of all reviews",
					"queries": ["category", "sort_by", "order"],
					"exampleResponse": {
						"reviews": [
							{
							"review_title": "One Night Ultimate Werewolf",
							"review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
							"game_designer": "Akihisa Okui",
							"game_category": "hidden-roles",
							"game_owner": "happyamy2016",
							"review_votes": 5,
							"created_at": 1610964101251,
							"comment_count": 1
							}
						]
					}
				},
				"GET /api/comments": {
					"description": "serves an array of all comments",
					"queries": [],
					"exampleResponse": {
						"review": [
							{
							"comment_id": 1,
							"comment_body": 'I loved this game too!',
							"comment_author": 'bainesface',
							"review_id": 2,
							"comment_votes": 16,
							"comment_created_at": new Date(1511354613389),
							},
						]
					}
				},
				"GET /api/reviews/:review_id": {
					"description": "serves an object containing the associated review",
					"queries": [],
					"exampleResponse": {
						"review": {
							"review_id": 8,
							"review_title": "One Night Ultimate Werewolf",
							"review_body": "We couldn't find the werewolf!",
							"review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
							"game_designer": "Akihisa Okui",
							"game_category": "hidden-roles",
							"game_owner": "happyamy2016",
							"review_votes": 5,
							"created_at": 1610964101251,
							"comment_count": 1
						}
					}
				},
				"PATCH /api/reviews/:review_id": {
					"description": "accepts a request body and serves an object containing the updated review",
					"requestBody": "{ inc_votes: newVote }",
					"exampleRequestBody": "{ inc_votes: 5 }",
					"exampleResponse": {
						"review": {
							"review_id": 8,
							"review_title": "One Night Ultimate Werewolf",
							"review_body": "We couldn't find the werewolf!",
							"review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
							"game_designer": "Akihisa Okui",
							"game_category": "hidden-roles",
							"game_owner": "happyamy2016",
							"review_votes": 10,
							"created_at": 1610964101251,
						}
					}
				},
				"GET /api/reviews/:review_id/comments": {
					"description": "serves an array containing all the comments associated with the specified review",
					"queries": [],
					"exampleResponse": {
						"comments": [
							{
							"comment_id": 1,
							"comment_body": 'I loved this game too!',
							"comment_author": 'bainesface',
							"comment_votes": 16,
							"comment_created_at": new Date(1511354613389),
							}
						]
					}
				},
				"POST /api/reviews/:review_id/comments": {
					"description": "accepts a request body and serves an object containing the posted comment",
					"requestBody": "{ author: 'commenter_username', body: 'comment_body' }",
					"exampleRequestBody": "{author: 'philippaclaire9', body: 'Great fun for the fam!'}",
					"exampleResponse": {
						"comment": {
							"comment_id": 62,
							"comment_body": 'Great fun for the fam!',
							"comment_author": 'philippaclaire9',
							"review_id": 2,
							"comment_votes": 0,
							"comment_created_at": new Date(1511354613389),
						}
					}
				},
				"DELETE /api/comments/:comment_id": {
					"description": "deletes the specified comment",
				}
			}
		}
	});
};