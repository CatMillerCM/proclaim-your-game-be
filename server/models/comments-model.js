const db = require("../../db");

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
        SET comment_votes = comment_votes + $2
        WHERE comment_id = $1
        RETURNING*;`, [id, inc_votes])
    if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "Comment not found." });
    } 
    return rows[0];
}