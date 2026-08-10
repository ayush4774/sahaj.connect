import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    const post = await Post.create({
      caption,
      author: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = 10;

    const posts = await Post.find()
      .populate("author", "name username avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name username avatar")
      .populate("comments.user", "name username avatar");

    if (!post)
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });

    res.json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });

    await post.deleteOne();

    res.json({
      success: true,
      message: "Post deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });

    post.comments.push({
      user: req.user._id,
      text,
    });

    await post.save();

    res.json({
      success: true,
      data: post.comments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};