//REQUIRES
const db = require("../");
const format = require("pg-format");



const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  return (

//DROPS TABLES IF EXIST
      db.query(`DROP TABLE IF EXISTS comments;`)
      .then(() => db.query(`DROP TABLE IF EXISTS reviews;`))
      .then(() => db.query(`DROP TABLE IF EXISTS users;`))
      .then(() => db.query(`DROP TABLE IF EXISTS categories;`))

//CREATES TABLES
      .then(() => {
        return db.query(`
        CREATE TABLE categories (
          category_slug VARCHAR NOT NULL PRIMARY KEY,
          category_description TEXT
        );`);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE users (
          username VARCHAR NOT NULL PRIMARY KEY,
          user_name	VARCHAR,
          user_avatar_url VARCHAR
        );`);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE reviews (
          review_id SERIAL PRIMARY KEY,
          review_title VARCHAR NOT NULL,
          review_body	TEXT NOT NULL,
          review_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          game_designer VARCHAR,
          game_category VARCHAR REFERENCES categories(category_slug),
          game_owner VARCHAR REFERENCES users(username),
          review_votes INT NOT NULL DEFAULT 0,
          review_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          comment_body TEXT NOT NULL,
          comment_author VARCHAR REFERENCES users(username),
          review_id INT REFERENCES reviews(review_id),
          comment_votes INT NOT NULL DEFAULT 0,
          comment_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`);
      })

//INPUTS DATA TO TABLES
      .then(() => {
        const categoryStr = format(
        `INSERT INTO categories (category_slug, category_description) VALUES %L;`,
        categoryData.map((categoryObj) => {
          return [categoryObj.slug, categoryObj.description];
        }));
        return (db.query(categoryStr))
      })
      .then(() => {
        const userStr = format(
        `INSERT INTO users (username, user_name, user_avatar_url) VALUES %L;`,
        userData.map((userObj) => {
          return [userObj.username, userObj.name, userObj.avatar_url];
        }));
        return (db.query(userStr))
      })
      .then(() => {
        const reviewStr = format(
        `INSERT INTO reviews (review_title, review_body, review_img_url, game_designer, game_category, game_owner, review_votes, review_created_at) VALUES %L;`,
        reviewData.map((reviewObj) => {
          return [reviewObj.title, reviewObj.review_body, reviewObj.review_img_url, reviewObj.designer, reviewObj.category, reviewObj.owner, reviewObj.votes, reviewObj.created_at];
        }));
        return (db.query(reviewStr))
      })
      .then(() => {
        const commentStr = format(
        `INSERT INTO comments (comment_body, comment_author, review_id, comment_votes, comment_created_at) VALUES %L;`,
        commentData.map((commentObj) => {
          return [commentObj.body, commentObj.author, commentObj.review_id, commentObj.votes, commentObj.created_at];
        }));
        return (db.query(commentStr))
      })
)};



module.exports = seed;
