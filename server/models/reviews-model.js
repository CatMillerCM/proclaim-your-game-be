const db = require("../../db");

exports.selectReviewById = async (id) => {
    const { rows } = await db.query(
        `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
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

exports.selectReviews = async (sort_by = "review_created_at") => {
    if (!["review_id", "review_title", "review_img_url", "game_category", "game_owner", "review_votes", "review_created_at", "comment_count"].includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort_by query." });
    }
    const { rows } = await db.query(`SELECT reviews.review_id, reviews.review_title, reviews.review_img_url, reviews.game_category, reviews.game_owner, reviews.review_votes, reviews.review_created_at, COUNT(comments.review_id) AS comment_count 
    FROM reviews 
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id 
    GROUP BY reviews.review_id 
    ORDER BY ${sort_by} ASC;`)
    return rows;
};