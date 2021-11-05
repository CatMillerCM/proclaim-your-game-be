const db = require("../db");

exports.createCategoriesTable = () => {
  return db.query(`
  CREATE TABLE categories (
    slug VARCHAR NOT NULL PRIMARY KEY,
    description TEXT
  );`);
};

exports.createUsersTable = () => {
  return db.query(`
  CREATE TABLE users (
    username VARCHAR NOT NULL PRIMARY KEY,
    name	VARCHAR NOT NULL,
    avatar_url VARCHAR
  );`);
};

exports.createReviewsTable = () => {
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
    created_at TIMESTAMP DEFAULT NOW()
  );`);
};

exports.createCommentsTable = () => {
  return db.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    author VARCHAR REFERENCES users(username),
    review_id INT REFERENCES reviews(review_id),
    votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
  );`);
};