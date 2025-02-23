const express = require("express");
var app = express();

//middleware
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

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
    useUnifiedTopology: true
});

// where the React app sits
app.use(express.static("public"));

// const posts = require("./routes/post");
// app.use("/api/posts", posts);

const users = require("./routes/user");
app.use("/api/users", users);

// const token = require("./routes/token");
// app.use("/api/tokens", token);

app.listen(process.env.PORT);
