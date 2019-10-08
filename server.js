const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");

// DB Config
const db = require("./config/keys").mongoURI;
// Connect Mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Mongo is connected"))
  .catch(err => console.log(err));
// var MongoClient = require("mongodb").MongoClient;

//Enabling body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => res.send("Hello!"));

//passport middleware
app.use(passport.initialize());
//passport config
require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
