const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads" });

const db = require("../lib/db");

router.get("/", (req, res) => {
  const resMimeType = req.accepts(["json", "html"]);
  if (!resMimeType) return;
  db.query("SELECT * FROM users", (err, users) => {
    if (err) throw err;
    if (resMimeType === "json") {
      res.send(users);
    } else if (resMimeType === "html") {
      res.render("userlist", { users });
    }
  });
});

router.param("id", (req, res, next, value) => {
  db.query("SELECT * FROM users WHERE id = ?", [value], (err, users) => {
    if (err) throw err;
    const user = users[0];
    if (!user) {
      const err = new Error("User not found. 못찾겠어");
      err.statusCode = 404;
      throw err;
    }
    req.user = user;
    next();
  });
});

router.get("/:id", (req, res) => {
  const resMimeType = req.accepts(["json", "html"]);
  if (resMimeType === "json") {
    res.send(req.user);
  } else if (resMimeType === "html") {
    res.render("user-profile", {
      user: req.user,
    });
  }
});

router.get("/:id/nickname", (req, res) => {
  res.render("nickname", {
    url: req.originalUrl,
    user: req.user,
  });
});
router.post("/:id/nickname", (req, res) => {
  const { user } = req;
  const { nickname } = req.body;
  db.query("UPDATE users SET nickname=? WHERE id=?", [nickname, user.id], (err) => {
    if (err) throw err;
    res.redirect(req.originalUrl.slice(0, -9));
  });
});

router.post("/:id/profile", upload.single("profile"), (req, res) => {
  const { user } = req;
  const { filename } = req.file;
  db.query("UPDATE users SET profile=? WHERE id=?", [filename, user.id], (err) => {
    if (err) throw err;
    res.redirect(`/users/${user.id}`);
  });
});

module.exports = router;
