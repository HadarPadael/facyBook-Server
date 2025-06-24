const express = require("express");
const path = require("path");

var app = express();

//middleware
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));

//middleware
const cors = require("cors");
app.use(cors());

const customEnv = require("custom-env");
customEnv.env(process.env.NODE_ENV, "./config");
console.log(process.env.CONNECTION_STRING);
console.log(process.env.PORT);

const mongoose = require("mongoose");
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Serve the React build assets
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Fallback: for any “page” request, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const posts = require("./routes/post");
app.use("/api/posts", posts);

const users = require("./routes/user");
app.use("/api/users", users);

const token = require("./routes/token");
app.use("/api/tokens", token);

app.listen(process.env.PORT);
