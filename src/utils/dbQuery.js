const db = require("../../config/db");

const queryAsync = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) return reject(new Error(err.message));
            resolve(result);
        });
    });
};

module.exports = queryAsync;
