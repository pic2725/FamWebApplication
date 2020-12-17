const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

require("dotenv").config();

let User = require("../../models/user.model");

// @route  POST /auth/
// @desc   Auth user
// @access public
router.route("/").post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Simple Validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  //Check for user by email
  User.findOne({ email: email }).then((user) => {
    //if user doesn't exist'
    if (!user) {
      return res.status(400).json({ msg: "User Does not exists" });
    }

    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      //input password doesn't match password in db
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      jwt.sign(
        { id: user.id },
        process.env.jwtSecret,
        { expiresIn: 3600 }, //expires in a hour
        (err, token) => {
          if (err) throw err;

          res.json({
            token: token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
            },
          });
        }
      );
    });
  });
});

// @route  GET api/auth/user
// @desc   Get user data
// @access Private
router.route("/user").get(auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
