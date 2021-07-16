const express = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const User = require("../../models/User");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route   POST  api/auth
//@desc    Login and auth route
//@access  Public
router.post(
  "/",
  [
    // Check for email and other user stuff using express validator
    check("email", "Please enter a valid Email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    // if the validation returns errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // else if Validation-errors arn't found.
    // We can use the user data using "req.body"

    // User credentials from frontend
    const { email, password } = req.body;

    try {
      // get the user from db
      let user = await User.findOne({ email }); // In es6 we can write email: email as email only

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Password match
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id, //when we save to DB we get an id, moongose converts _id -> id.
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
