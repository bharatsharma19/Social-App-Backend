const router = require("express").Router();
const User = require("../modals/User");
const bcrypt = require("bcrypt");

// Register
router.post("/register", async (req, res) => {
  try {
    // Encrypting Password
    const salt = await bcrypt.genSalt(16);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Posting Details
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Creating New User
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    console.log("Error : ", error);
  }
});

// Login
router.post("/login", (req, res) => {});

module.exports = router;
