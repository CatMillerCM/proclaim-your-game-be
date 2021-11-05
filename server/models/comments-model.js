const db = require("../../db");


exports.selectCommentsByReview = async (id) => {
    const reviews = await db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
    
    if (reviews.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review not found." });
    }
    const { rows } = await db.query(`
    SELECT comment_id, body, author, votes, created_at 
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
    INSERT INTO comments (author, body, votes, review_id, created_at) 
    VALUES ($1, $2, 0, $3, CURRENT_TIMESTAMP) 
    RETURNING *;`, [author, body, id]);

    return rows[0];
};


exports.selectComments = async () => {
    const { rows } = await db.query(`SELECT * FROM comments;`)
    return rows;
};

exports.removeComments = async (id) => {

    const comments = await db.query(`SELECT * FROM comments WHERE comment_id = $1;`, [id])
    
    if (comments.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found." });
    }

    return await db.query(`
    DELETE FROM comments
    WHERE comment_id = $1;`, [id]);
};

exports.updateCommentVotes = async (id, update) => {
    const { inc_votes } = update;

    if (typeof inc_votes != "number") {
        return Promise.reject({ status: 400, msg: "Invalid patch object." });
    }
    if (Object.keys(update).length != 1) {
        return Promise.reject({ status: 422, msg: "Invalid patch object." });
    } 
    const { rows } = await db.query(
        `UPDATE comments
        SET votes = votes + $2
        WHERE comment_id = $1
        RETURNING*;`, [id, inc_votes])
    if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "Comment not found." });
    } 
    return rows[0];
}