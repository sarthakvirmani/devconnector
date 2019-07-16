const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const app = express();
//DB Config
const db = require("./config/keys").mongoURI;
//Connect Mongo
mongoose
  .connect(db)
  .then(() => console.log("Mongo is connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello!"));

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
