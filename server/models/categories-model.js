const db = require("../../db");

exports.selectCategories = async () => {
    const { rows } = await db.query(`SELECT * FROM categories;`)
    return rows;
};