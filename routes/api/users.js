const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const User = require("../../models/User");
// @Route GET api/users/test
// desc test users route
// access public
router.get("/test", (req, res) => res.json({ msg: "users works" }));

// @Route POST api/users/register
// desc register a user
// access public
router.post("/register", (req, res) => {
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
        //User Matched
        const payload = { id: user.id, name: user.name, email: user.email };
        // //Sign Token
        jwt.sign(
          payload,
          keys.secretorKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer" + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Incorrect Password" });
      }
    });
  });
});

// @Route POST api/users/current
// desc Return current user
// access private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "Success" });
  }
);
module.exports = router;
