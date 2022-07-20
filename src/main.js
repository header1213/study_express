const express = require("express");

const app = express();
const PORT = 5000;

app.set("view engine", "pug");
app.set("views", "src/views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static("src/public"));
app.use("/uploads", express.static("uploads"));

const userRouter = require("./routers/user");
app.use("/users", userRouter);

app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500;
  res.send(err.message);
});

app.get("/", (req, res) => {
  res.render("index", {
    message: "hello, pug!!!!!!!!!!!!!",
  });
});

app.listen(PORT, () => {
  console.log(`Express 서버 작동 중, 포트: ${PORT}`);
});
