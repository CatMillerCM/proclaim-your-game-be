const db = require("../db");
const format = require("pg-format");


exports.inputsToCategories = (categoryData) => {
    const categoryStr = format(
    `INSERT INTO categories (slug, description) VALUES %L;`,
    categoryData.map((categoryObj) => {
        return [categoryObj.slug, categoryObj.description];
    }));
    return (db.query(categoryStr))
};

exports.inputsToReviews = (reviewData) => {
    const reviewStr = format(
    `INSERT INTO reviews (title, review_body, review_img_url, designer, category, owner, votes, created_at) VALUES %L;`,
    reviewData.map((reviewObj) => {
        return [reviewObj.title, reviewObj.review_body, reviewObj.review_img_url, reviewObj.designer, reviewObj.category, reviewObj.owner, reviewObj.votes, reviewObj.created_at];
    }));
    return (db.query(reviewStr))
};

exports.inputsToUsers = (userData) => {
    const userStr = format(
    `INSERT INTO users (username, name, avatar_url) VALUES %L;`,
    userData.map((userObj) => {
        return [userObj.username, userObj.name, userObj.avatar_url];
    }));
    return (db.query(userStr))
};

exports.inputsToComments = (commentData) => {
    const commentStr = format(
    `INSERT INTO comments (body, author, review_id, votes, created_at) VALUES %L;`,
    commentData.map((commentObj) => {
        return [commentObj.body, commentObj.author, commentObj.review_id, commentObj.votes, commentObj.created_at];
    }));
    return (db.query(commentStr))
};