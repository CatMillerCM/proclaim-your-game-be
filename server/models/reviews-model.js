const db = require("../../db");

exports.selectReviewById = async (id) => {
    const { rows } = await db.query(
        `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
        FROM reviews 
        LEFT JOIN comments
        ON reviews.review_id = comments.review_id
        WHERE reviews.review_id = $1 
        GROUP BY reviews.review_id;`, [id])
    if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "Review not found." });
    } return rows[0];
};

exports.updateReviewVotes = async (id, update) => {
    const { inc_votes } = update;
    if (typeof inc_votes != "number") {
        return Promise.reject({ status: 400, msg: "Invalid patch object." });
    }
    if (Object.keys(update).length != 1) {
        return Promise.reject({ status: 422, msg: "Invalid patch object." });
    } 
    const { rows } = await db.query(
        `UPDATE reviews
        SET review_votes = review_votes + $2
        WHERE review_id = $1
        RETURNING*;`, [id, inc_votes])
    if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "Review not found." });
    } return rows[0];
}

exports.selectReviews = async (sort_by = "review_created_at", order = "desc", game_category) => {
    if (!["review_id", "review_title", "review_img_url", "game_category", "game_owner", "review_votes", "review_created_at", "comment_count"].includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort_by query." });
    }
    if (!['asc', 'desc'].includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query.' });
    }

    const queryValues = [];

    let queryStr = `SELECT reviews.review_id, reviews.review_title, reviews.review_img_url, reviews.game_category, reviews.game_owner, reviews.review_votes, reviews.review_created_at, COUNT(comments.review_id)::INT AS comment_count 
    FROM reviews 
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id `

    if (game_category) {
        queryValues.push(game_category);
        queryStr += `WHERE game_category = $1 `;
    }
    
    queryStr += `GROUP BY reviews.review_id 
    ORDER BY ${sort_by} ${order};`

    const { rows } = await db.query(queryStr, queryValues);

    if (rows.length === 0) {
        const categoryResult = await db.query(`
        SELECT * FROM categories WHERE category_slug = $1;`, [game_category]);


        if (categoryResult.rows.length === 0) {
            return Promise.reject({status: 400, msg: "No games match this category",
            });
        }
    }
    return rows;
};


exports.selectCommentsByReview = async (id) => {
    const reviews = await db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
    
    if (reviews.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review not found." });
    }
    const { rows } = await db.query(`
    SELECT comment_id, comment_body, comment_author, comment_votes, comment_created_at 
    FROM comments 
    WHERE review_id = $1;`, [id]);
    return rows;
};

exports.createComment = async (id, commentObj) => {

    if (Object.keys(commentObj).length === 0) {
        return Promise.reject({ status: 400, msg: "Invalid post object." });
    }
    
    if (Object.keys(commentObj).length != 2) {
        return Promise.reject({ status: 422, msg: "Invalid post object." });
    }

    const { author, body } = commentObj;

    const reviews = await db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [id]);
    if (reviews.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review not found." });
    }

    if (typeof author != "string" || typeof body != "string") {
        return Promise.reject({ status: 400, msg: "Invalid post object." });
    }

    const allUsers = await db.query(`SELECT username FROM users;`);
    const usernameArray = allUsers.rows.map((user) => user.username);
    if (!usernameArray.includes(author)) {
        return Promise.reject({ status: 400, msg: "Invalid username." });
    }

    const { rows } = await db.query(`
    INSERT INTO comments (comment_author, comment_body, comment_votes, review_id, comment_created_at) 
    VALUES ($1, $2, 0, $3, CURRENT_TIMESTAMP) 
    RETURNING *;`, [author, body, id]);

    return rows[0];
};