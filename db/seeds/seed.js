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
          user_avatar_url VARCHAR,
          user_name	VARCHAR
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
          comment_author VARCHAR REFERENCES users(username),
          review_id INT REFERENCES reviews(review_id),
          comment_body TEXT NOT NULL,
          comment_votes INT NOT NULL DEFAULT 0,
          comment_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`);
      })
)};



module.exports = seed;
