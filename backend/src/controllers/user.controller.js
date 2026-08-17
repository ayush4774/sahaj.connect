import User from "../models/User.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("followers", "name username avatar")
      .populate("following", "name username avatar")
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }

    if (typeof bio === "string") {
      user.bio = bio.trim();
    }

    await user.save();

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req, res, next) => {
  try {
    const target = await User.findById(req.params.id);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (target._id.equals(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const alreadyFollowing = req.user.following.some((id) =>
      id.equals(target._id)
    );

    if (alreadyFollowing) {
      return res.status(400).json({
        success: false,
        message: "Already following this user",
      });
    }

    req.user.following.push(target._id);
    target.followers.push(req.user._id);

    await Promise.all([
      req.user.save(),
      target.save(),
    ]);

    return res.json({
      success: true,
      message: "Followed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const target = await User.findById(req.params.id);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user.following.pull(target._id);
    target.followers.pull(req.user._id);

    await Promise.all([
      req.user.save(),
      target.save(),
    ]);

    return res.json({
      success: true,
      message: "Unfollowed successfully",
    });
  } catch (error) {
    next(error);
  }
};