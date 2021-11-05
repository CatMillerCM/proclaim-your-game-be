exports.createCategoriesTable = `
CREATE TABLE categories (
  category_slug VARCHAR NOT NULL PRIMARY KEY,
  category_description TEXT
);`

exports.createUsersTable = `
CREATE TABLE users (
  username VARCHAR NOT NULL PRIMARY KEY,
  user_name	VARCHAR NOT NULL,
  user_avatar_url VARCHAR
);`

exports.createReviewsTable = `
CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  review_title VARCHAR NOT NULL,
  review_body	TEXT NOT NULL,
  review_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
  game_designer VARCHAR,
  game_category VARCHAR REFERENCES categories(category_slug),
  game_owner VARCHAR REFERENCES users(username),
  review_votes INT DEFAULT 0,
  review_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`

exports.createCommentsTable = `
CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  comment_body TEXT NOT NULL,
  comment_author VARCHAR REFERENCES users(username),
  review_id INT REFERENCES reviews(review_id),
  comment_votes INT DEFAULT 0,
  comment_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`