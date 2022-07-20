const mysql = require("mysql");

let CN = 0;

const envs = [
  {
    host: "localhost",
    password: "daniel041213!",
  },
];

module.exports = {
  query: function (...args) {
    const db = mysql.createConnection({
      host: envs[CN].host,
      user: "root",
      password: envs[CN].password,
      database: "express",
    });

    db.connect();
    db.query(...args);
    db.end();
  },
};
