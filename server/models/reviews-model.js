const db = require("../../db");

exports.selectReviewById = async (id) => {
    const { rows } = await db.query(
        `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
        FROM reviews 
        LEFT JOIN comments
        ON reviews.review_id = comments.review_id
        WHERE reviews.review_id = $1 
        GROUP BY reviews.review_id;`, [id])

    if (!rows[0]) return Promise.reject({ status: 404, msg: "Review not found." });

    return rows[0];
};


exports.updateReviewVotes = async (id, update) => {
    const { inc_votes } = update;
    if (Object.keys(update).length === 0) {
        const { rows } = await db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [id]);
        return rows[0];
    };

    if (typeof inc_votes != "number") return Promise.reject({ status: 400, msg: "Invalid patch object." });
    if (Object.keys(update).length > 1) return Promise.reject({ status: 422, msg: "Invalid patch object." });

    const { rows } = await db.query(
        `UPDATE reviews
        SET votes = votes + $2
        WHERE review_id = $1
        RETURNING*;`, [id, inc_votes]);

    if (!rows[0]) return Promise.reject({ status: 404, msg: "Review not found." });
    
    return rows[0];
};


exports.selectReviews = async (sort_by = "created_at", order = "desc", category, limit = 10, p = 1) => {

    if (!["review_id", "title", "review_img_url", "category", "owner", "votes", "created_at", "comment_count"].includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort_by query." });
    };

    if (!['asc', 'desc'].includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query.' });
    };

    const queryValues = [];

    let queryStr = `SELECT reviews.review_id, reviews.title, reviews.review_img_url, reviews.category, reviews.owner, reviews.votes, reviews.created_at, COUNT(comments.review_id)::INT AS comment_count 
    FROM reviews 
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id `

    if (category) {
        queryValues.push(category);
        queryStr += `WHERE category = $1 `;
    };
    
    queryStr += `GROUP BY reviews.review_id 
    ORDER BY ${sort_by} ${order};`

    const { rows } = await db.query(queryStr, queryValues);

    if (rows.length === 0) {
        const categoryResult = await db.query(`
        SELECT * FROM categories WHERE slug = $1;`, [category]);

        if (categoryResult.rows.length === 0) return Promise.reject({status: 404, msg: "Non-existent category."});
    };

    if (!(limit > 0)) return Promise.reject({status: 400, msg: "Invalid limit query."});
    if (limit > 10) return Promise.reject({status: 400, msg: "Limit query exceeds maximum of 10."});
    if (!(p > 0)) return Promise.reject({status: 400, msg: "Invalid page query."});
    if (p > Math.ceil(rows.length/limit) && rows.length != 0) return Promise.reject({status: 404, msg: "Page number not found."});

    if (rows.length > limit) {
        const limitedRows = rows.slice((limit * (p-1)), (limit * p)); 
        return { total_count: rows.length, reviews: limitedRows };
    };
    return { total_count: rows.length, reviews: rows };
};