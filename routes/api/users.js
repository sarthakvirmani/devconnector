const express = require("express");
const router = express.Router();

// @Route GET api/users/test
// desc test users route
// access public
router.get("/test", (req, res) => res.json({ msg: "users works" }));

module.exports = router;
