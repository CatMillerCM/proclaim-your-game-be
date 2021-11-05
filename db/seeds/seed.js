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
          slug VARCHAR NOT NULL PRIMARY KEY,
          description TEXT
        );`);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE users (
          username VARCHAR NOT NULL PRIMARY KEY,
          name	VARCHAR NOT NULL,
          avatar_url VARCHAR
        );`);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE reviews (
          review_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          review_body	TEXT NOT NULL,
          review_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          designer VARCHAR,
          category VARCHAR REFERENCES categories(slug),
          owner VARCHAR REFERENCES users(username),
          votes INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          body TEXT NOT NULL,
          author VARCHAR REFERENCES users(username),
          review_id INT REFERENCES reviews(review_id),
          votes INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);
      })

//INPUTS DATA TO TABLES
      .then(() => {
        const categoryStr = format(
        `INSERT INTO categories (slug, description) VALUES %L;`,
        categoryData.map((categoryObj) => {
          return [categoryObj.slug, categoryObj.description];
        }));
        return (db.query(categoryStr))
      })
      .then(() => {
        const userStr = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L;`,
        userData.map((userObj) => {
          return [userObj.username, userObj.name, userObj.avatar_url];
        }));
        return (db.query(userStr))
      })
      .then(() => {
        const reviewStr = format(
        `INSERT INTO reviews (title, review_body, review_img_url, designer, category, owner, votes, created_at) VALUES %L;`,
        reviewData.map((reviewObj) => {
          return [reviewObj.title, reviewObj.review_body, reviewObj.review_img_url, reviewObj.designer, reviewObj.category, reviewObj.owner, reviewObj.votes, reviewObj.created_at];
        }));
        return (db.query(reviewStr))
      })
      .then(() => {
        const commentStr = format(
        `INSERT INTO comments (body, author, review_id, votes, created_at) VALUES %L;`,
        commentData.map((commentObj) => {
          return [commentObj.body, commentObj.author, commentObj.review_id, commentObj.votes, commentObj.created_at];
        }));
        return (db.query(commentStr))
      })

)};



module.exports = seed;
