const router = require("express").Router();
const auth = require("../../middleware/auth");

require("dotenv").config();

let Item = require("../../models/item.model");

/**
 * @route   GET /items
 * @desc    Get All Items
 * @access  Public
 */
router.route("/").get((req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then((items) => res.json(items));
});

/**
 * @route   POST /items
 * @desc    add Item
 * @access  Private
 */
router.route("/").post(auth, (req, res) => {
  const newItem = new Item({
    name: req.body.name,
  });
  newItem.save().then((item) => res.json(item));
});

/**
 * @route   DELETE /items
 * @desc    delete Item
 * @access  Private
 */
router.route("/:id").delete(auth, (req, res) => {
  Item.findByIdAndDelete(req.params.id)
    .then(() => res.json("Successfully deleted a user"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
