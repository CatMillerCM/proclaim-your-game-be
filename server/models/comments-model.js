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