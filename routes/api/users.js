const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// Getting USER MODEL
const User = require("../../models/User");

//@route   POST  api/users
//@desc    Register route
//@access  Public
router.post(
  "/",
  [
    // Check for email and other user stuff using express validator
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid Email").isEmail(),
    check(
      "password",
      "Please enter a password of length greater than 6"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // if the validation returns errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // else if Validation-errors arn't found.
    // We can use the user data using "req.body"

    /*
    Now, we have to do 4 things
    1. See if the user exist in DB
    2. Get the user gravatar
    3. Encrypt Password
    4. Return JWT(jsonwebtoken)
    */

    const { name, email, password } = req.body;

    try {
      // 1.
      let user = await User.findOne({ email }); // In es6 we can write email: email as email only

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      // 2.
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      // Creating a new user instance
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // 3.
      const salt = await bcrypt.genSalt(10); //the more the number => more secure
      user.password = await bcrypt.hash(password, salt);

      // Saving info to mongoDB
      await user.save();

      // 4.
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
