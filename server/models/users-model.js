const db = require("../../db");

exports.selectUsers = async () => {
    const { rows } = await db.query(`SELECT username FROM users;`)
    return rows;
};


exports.selectUserByUsername = async (username) => {
    const allUsers = await db.query(`SELECT username FROM users;`);
    const usernameArray = allUsers.rows.map((user) => user.username);
    if (!usernameArray.includes(username)) return Promise.reject({ status: 404, msg: "Username not found." });

    const { rows } = await db.query(`
    SELECT username, name, avatar_url 
    FROM users
    WHERE username = $1;`, [username])

    return rows[0];
};