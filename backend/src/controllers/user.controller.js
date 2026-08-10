import User from "../models/User.js";

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("followers", "name username avatar")
    .populate("following", "name username avatar")
    .select("-password");

  res.json({
    success: true,
    data: user,
  });
};

export const updateProfile = async (req, res) => {
  const { name, bio } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;

  if (bio) user.bio = bio;

  await user.save();

  res.json({
    success: true,
    data: user,
  });
};

export const followUser = async (req, res) => {
  const target = await User.findById(req.params.id);

  if (!target)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });

  if (!target.followers.includes(req.user._id))
    target.followers.push(req.user._id);

  if (!req.user.following.includes(target._id))
    req.user.following.push(target._id);

  await target.save();
  await req.user.save();

  res.json({
    success: true,
    message: "Followed",
  });
};

export const unfollowUser = async (req, res) => {
  const target = await User.findById(req.params.id);

  target.followers.pull(req.user._id);

  req.user.following.pull(target._id);

  await target.save();
  await req.user.save();

  res.json({
    success: true,
    message: "Unfollowed",
  });
};