const db = require("../db");

exports.dropCommentsTable = () => db.query(`DROP TABLE IF EXISTS comments;`);

exports.dropReviewsTable = () => db.query(`DROP TABLE IF EXISTS reviews;`);

exports.dropUsersTable = () => db.query(`DROP TABLE IF EXISTS users;`);

exports.dropCategoriesTable = () => db.query(`DROP TABLE IF EXISTS categories;`)