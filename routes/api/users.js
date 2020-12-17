const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

let User = require("../../models/user.model");

//End Points

/**
 * @route   GET /users/items
 * @desc    Get All Items
 * @access  Public
 */
router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

// @route  POST api/users/
// @desc   Register new user
// @access public
router.route("/").post((req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // Simple Validation
  if (!name || !password || !email) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  //Check for existing user by email
  User.findOne({ email: email }).then((user) => {
    //if user exists
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const newUser = new User({
      name,
      password,
      email,
    });

    // Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        //add hash to password
        newUser.password = hash;
        newUser.save().then((user) => {
          //json web token
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
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
});

// @route  DELETE users/:id
// @desc   delete a user by id
// @access public
router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("Successfully deleted a user"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
