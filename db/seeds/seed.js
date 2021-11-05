//REQUIRES
const db = require("../");
const format = require("pg-format");
const { createCategoriesTable, createCommentsTable, createUsersTable, createReviewsTable } = require("../../utils/create-tables");
const { dropCommentsTable, dropUsersTable, dropReviewsTable, dropCategoriesTable } = require("../../utils/drop-tables");
const { inputsToCategories, inputsToUsers, inputsToReviews, inputsToComments } = require("../../utils/input-data-to-tables")


const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  return (

//DROPS TABLES IF EXIST
    dropCommentsTable()
      //db.query(`DROP TABLE IF EXISTS comments;`)
      .then(dropReviewsTable)
      .then(dropUsersTable)
      .then(dropCategoriesTable)

//CREATES TABLES
      .then(createCategoriesTable)
      .then(createUsersTable)
      .then(createReviewsTable)
      .then(createCommentsTable)

//INPUTS DATA TO TABLES
      .then(() => inputsToCategories(categoryData))
      .then(() => inputsToUsers(userData))
      .then(() => inputsToReviews(reviewData))
      .then(() => inputsToComments(commentData))
)};



module.exports = seed;
