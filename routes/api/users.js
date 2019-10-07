const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const User = require("../../models/User");
// @Route GET api/users/test
// desc test users route
// access public
router.get("/test", (req, res) => res.json({ msg: "users works" }));

// @Route POST api/users/register
// desc register a user
// access public
router.post("/register", (req, res) => {
  // console.info(req.body.email);

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" //default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @Route POST api/users/login
// desc Login User/Returning JWT(json web token)
// access public

router.post("/login", (req, res) => {
  console.info(req.body.email);
  const email = req.body.email;

  const password = req.body.password;
  //Find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "user not found" });
    }

    //Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ msg: "Success" });
      } else {
        return res.status(400).json({ password: "Incorrect Password" });
      }
      //Check Password
      // bcrypt.compare(password, user.password).then(isMatch => {
      //   if (isMatch) {
      //     res.json({ msg: "Success" });
      //   } else {
      //     return res.status(400).json({ password: "Incorrect Password" });
      //   }
    });
  });
});

module.exports = router;
