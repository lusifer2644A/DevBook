const express = require("express");
const config = require("config");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const request = require("request");

//@route   Get  api/profile/me
//@desc    User profile route
//@access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile)
      return res.status(400).json({ msg: "User Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

//@route   POST  api/profile/me
//@desc    User profile route
//@access  Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty())
      return res.status(400).json({ errors: error.array() });

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Build profile object

    const profileFields = {};

    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;

    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      //Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: false }
      );
      return res.json(profile);
    }

    //Create
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  }
);

//@route   GET  api/profile
//@desc    Get all profile
//@access  Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   GET  api/profile/user.:user_id
//@desc    Get the profile by user_id
//@access  Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found." });

    res.json(profile);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "Profile not found." });

    res.status(500).send("Server Error");
  }
});

//@route   DELETE api/profile
//@desc    Delete the posts, profile and the user
//@access  Private

router.delete("/", auth, async (req, res) => {
  try {
    //todo- posts

    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "Profile deleted." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   PUT api/profile
//@desc    Put the experience
//@access  Private
router.put(
  "/experience",
  [auth, [check("title", "Title is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { title, company, location, from, to, description, current } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      description,
      current,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route   DELETE api/profile/experience.:experience:id
//@desc    Delete the experienece
//@access  Private
router.delete("/experience/:experience_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.experience_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   PUT api/profile/education
//@desc    Put the education
//@access  Private
router.put(
  "/education",
  [auth, [check("school", "School is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school,
      degree,
      from,
      to,
      fieldofstudy,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route   DELETE api/profile/experience.:experience:id
//@desc    Delete the experienece
//@access  Private
router.delete("/education/:education_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.education_id);

    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   Get api/profile/github/:username
//@desc    Get the github repo
//@access  Public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubClientSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No github user found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
