const db = require("../../db");

exports.selectReviewById = async (id) => {
    const { rows } = await db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
    if (!rows[0]) {
        console.log("in reject")
        return Promise.reject({ status: 404, msg: "Review not found." });
    } else return rows[0];
};