const db = require("../../db");

exports.selectReviewById = async (id) => {
    const { rows } = await db.query(
    `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
    FROM reviews 
    JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE comments.review_id = $1 
    GROUP BY reviews.review_id;`, [id])
    if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "Review not found." });
    } else return rows[0];
};