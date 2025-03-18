
const checkUserQuery = "SELECT * FROM users WHERE email = ?";
const insertUser = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
const loginUser = "SELECT * FROM users WHERE email = ?";
const logoutUser = "INSERT INTO token_blacklist (token) VALUES (?)";

module.exports = {
    checkUserQuery,
    insertUser,
    loginUser,
    logoutUser,
};