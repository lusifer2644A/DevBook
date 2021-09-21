const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route   POST  api/posts
//@desc    Create a post
//@access  Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      const newPost = new Post({
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
        text: req.body.text,
      });

      await newPost.save();
      res.json(newPost);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route   GET  api/posts
//@desc    Get all posts
//@access  Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   GET  api/posts/:post_id
//@desc    Get post by id
//@access  Private
router.get("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(400).json({ msg: "Post not found :(" });

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "Post not found :(" });
    res.status(500).send("Server Error");
  }
});

//@route   DELETE  api/posts/:post_id
//@desc    delete post by id
//@access  Private
router.delete("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(400).json({ msg: "Post not found :(" });

    //Check user
    if (post.user.toString() !== req.user.id)
      res.status(401).json({ msg: "User not authorised :(" });

    await post.remove();
    res.json({ msg: " Post deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "Post not found :(" });
    res.status(500).send("Server Error");
  }
});

//@route   PUT  api/posts/like/:post_id
//@desc    add likes to a post
//@access  Private
router.put("/like/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    //Checking if already liked
    const userLiked = post.likes.filter(
      (item) => item.user.toString() === req.user.id
    );
    if (userLiked.length > 0)
      return res.status(400).json({ msg: "User already liked" });

    const newLike = {
      user: req.user.id,
    };

    post.likes.unshift(newLike);
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "Post not found :(" });
    res.status(500).send("Server Error");
  }
});

//@route   PUT  api/posts/unlike/:post_id
//@desc    Unlike to a post
//@access  Private
router.put("/unlike/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    //Checking if user liked
    const userLiked = post.likes.filter(
      (item) => item.user.toString() === req.user.id
    );
    if (userLiked.length === 0)
      return res.status(400).json({ msg: "User has not yet liked" });

    const removeIndex = post.likes
      .map((item) => item.user)
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "Post not found :(" });
    res.status(500).send("Server Error");
  }
});

//@route   PUT  api/posts/comment/:post_id
//@desc    add comments to a post
//@access  Private
router.put(
  "/comment/:post_id",
  [auth, check("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const post = await Post.findById(req.params.post_id);
      const user = await User.findById(req.user.id);

      if (!post) return res.status(400).json({ msg: "No post found" });
      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId")
        return res.status(400).json({ msg: "Post not found :(" });
      res.status(500).send("Server Error");
    }
  }
);

//@route   DELETE  api/posts/comment/:post_id/:comment_id
//@desc    delete comments to a post
//@access  Private
router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    //Pull out comments
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //Make sure comments exists
    if (!comment)
      return res.status(404).json({ msg: "Comment does not exist" });

    //Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorised!" });
    }

    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "Post not found :(" });
    res.status(500).send("Server Error");
  }
});

module.exports = router;
