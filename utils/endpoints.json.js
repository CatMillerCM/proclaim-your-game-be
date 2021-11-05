const endpoints = {
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
                        "description": "Players attempt to uncover each other's hidden role",
                        "slug": "Social deduction"
                        }
                    ]
                }
            },
            "GET /api/users": {
                "description": "serves an array of all usernames",
                "queries": [],
                "exampleResponse": {
                    "users": [{"username": 'tickle122'}]
                }
            },
            "GET /api/reviews": {
                "description": "serves an array of all reviews",
                "queries": ["category", "sort_by", "order"],
                "exampleResponse": {
                    "reviews": [
                        {
                        "title": "One Night Ultimate Werewolf",
                        "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                        "designer": "Akihisa Okui",
                        "category": "hidden-roles",
                        "owner": "happyamy2016",
                        "votes": 5,
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
                        "body": 'I loved this game too!',
                        "author": 'bainesface',
                        "review_id": 2,
                        "votes": 16,
                        "created_at": new Date(1511354613389),
                        },
                    ]
                }
            },
            "GET /api/users/:username": {
                "description": "serves an object containing the associated user",
                "queries": [],
                "exampleResponse": {
                    "user": {
                    "username": 'mallionaire',
                    "name": 'haz',
                    "avatar_url": 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                    }
                }
            },
            "GET /api/reviews/:review_id": {
                "description": "serves an object containing the associated review",
                "queries": [],
                "exampleResponse": {
                    "review": {
                        "review_id": 8,
                        "title": "One Night Ultimate Werewolf",
                        "review_body": "We couldn't find the werewolf!",
                        "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                        "designer": "Akihisa Okui",
                        "category": "hidden-roles",
                        "owner": "happyamy2016",
                        "votes": 5,
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
                        "title": "One Night Ultimate Werewolf",
                        "review_body": "We couldn't find the werewolf!",
                        "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                        "designer": "Akihisa Okui",
                        "category": "hidden-roles",
                        "owner": "happyamy2016",
                        "votes": 10,
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
                        "body": 'I loved this game too!',
                        "author": 'bainesface',
                        "votes": 16,
                        "created_at": new Date(1511354613389),
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
                        "body": 'Great fun for the fam!',
                        "author": 'philippaclaire9',
                        "review_id": 2,
                        "votes": 0,
                        "created_at": new Date(1511354613389),
                    }
                }
            },
            "DELETE /api/comments/:comment_id": {
                "description": "deletes the specified comment",
            },
            "PATCH /api/comments/:comment_id": {
                "description": "accepts a request body and serves an object containing the updated comment",
                "requestBody": "{ inc_votes: newVote }",
                "exampleRequestBody": "{ inc_votes: 5 }",
                "exampleResponse": {
                    "comment": {
                        "comment_id": 3,
                        "body": "I didn't know dogs could play games",
                        "votes": 15,
                        "author": 'weegembump',
                        "review_id": 4,
                        "created_at": new Date(1610964588110),
                    }
                }
            }
        }
    }
}

module.exports = endpoints;