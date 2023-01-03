const Users = require('../models/User');
const Posts = require('../models/Post');
const Tips = require('../models/Tip');
const Categories = require('../models/Category');
const PendingArticles = require('../models/Pending');
const RejectedArticles = require('../models/Rejected');
const Notifications = require('../models/Notification');
const bcrypt = require('bcrypt');

const { uploader } = require('../utils/index');

/**
 * @routes GET api/user
 * @desc Returns all users if request is from a Super Admin account
 * @access private
 */
exports.index = async (req, res) => {
  const { role } = req.user;
  try {
    if (role !== 'Super Admin')
      return res.status(401).json({
        status: 'error',
        code: 401,
        data: {
          message: 'You are not allowed to do this.',
        },
      });

    const users = await Users.find();
    res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({
      error: true,
      status: 'FAILED',
      code: 500,
      message: err.message,
    });
  }
};

/**
 * @routes PUT api/user/{id}
 * @desc Update user's details
 * @access public
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const user = req.user;
    const user_id = user.id.toString();

    const { role, password, profilePicture, email, ...update } = req.body;

    const fetchedUser = await Users.findById(id);
    const author = fetchedUser.firstname + ' ' + fetchedUser.lastname;

    if (user_id !== id.toString())
      return res.status(401).json({
        error: true,
        code: 401,
        message: 'You are not allowed to update this user',
      });

    const user_ = await Users.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true },
    );
    const updatedAuthor = user_.firstname + ' ' + user_.lastname;
    if (author !== updatedAuthor) {
      await Posts.updateMany(
        { author: author },
        { $set: { author: updatedAuthor } },
      );
      await Tips.updateMany(
        { author: author },
        { $set: { author: updatedAuthor } },
      );
      await Categories.updateMany(
        { author: author },
        { $set: { author: updatedAuthor } },
      );

      await Notifications.updateOne(
        { author: author },
        { $set: { author: updatedAuthor } },
      );

      await PendingArticles.updateMany(
        { author: author },
        { $set: { author: updatedAuthor } },
      );

      await RejectedArticles.updateMany(
        { author: author },
        { $set: { author: updatedAuthor } },
      );
    }
    return res.status(200).json({ message: 'Your profile has been updated!' });
  } catch (err) {
    return res.status(500).json({
      error: true,
      status: 'FAILED',
      code: 500,
      message: err,
    });
  }
};

/**
 * @routes PATCH api/user/{id}
 * @desc Update user's login email
 * @access public
 */
exports.updateEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const user = req.user;
    const user_id = user.id.toString();

    const { email } = req.body;
    const { password } = req.body;

    if (user_id !== id.toString())
      return res.status(401).json({
        error: true,
        code: 401,
        message: 'You are not allowed to update this user',
      });

    const user_ = await Users.findOne({ email: email }).select('+password');

    if (!user_)
      return res
        .status(401)
        .json({ message: 'You are not allowed to do that!' });

    // Validate password
    const validated = await bcrypt.compare(password, user_.password);
    if (!validated)
      return res.status(401).json({ message: 'Invalid email or password' });

    const user__ = await Users.findByIdAndUpdate(
      id,
      { $set: { email: req.body.newEmail } },
      { new: true },
    );

    res
      .status(200)
      .json({ message: 'Your login email has been successfully changed' });
  } catch (err) {
    return res.status(500).json({
      error: true,
      status: 'FAILED',
      code: 500,
      message: err.message,
    });
  }
};

/**
 * @routes PATCH api/user/upload/{id}
 * @desc Update user's profile image
 * @access public
 */
exports.upload = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const user_id = user._id.toString();

    const { profilePicture } = req.body;

    if (user_id !== id.toString())
      return res.status(401).json({
        error: true,
        code: 401,
        message: 'You are not allowed to update this user',
      });

    // Attempt to upload to cloudinary
    const result = await uploader(profilePicture);

    const user_ = await Users.findByIdAndUpdate(
      id,
      { $set: { profilePicture: result.secure_url } },
      { new: true },
    );

    const author = user_.firstname + ' ' + user_.lastname;

    await Posts.updateMany(
      { author: author },
      { $set: { avatar: result.secure_url } },
    );
    await Tips.updateMany(
      { author: author },
      { $set: { avatar: result.secure_url } },
    );
    await Categories.updateMany(
      { author: author },
      { $set: { avatar: result.secure_url } },
    );
    await PendingArticles.updateMany(
      { author: author },
      { $set: { avatar: result.secure_url } },
    );
    await RejectedArticles.updateMany(
      { author: author },
      { $set: { avatar: result.secure_url } },
    );

    return res.status(200).json({
      message: 'Your profile image has been successfully updated!',
      url: result.secure_url,
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      status: 'FAILED',
      code: 500,
      message: err,
    });
  }
};

/**
 * @routes GET api/user/{id}
 * @desc Get a user
 * @access public
 */
exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id.toString();

    if (user_id !== id.toString())
      return res.status(401).json({
        error: true,
        code: 401,
        message: 'You can only view an account that belongs to you.',
      });

    const user = await Users.findById(id);
    if (!user) return res.status(401).json({ message: 'User does not exist!' });
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({
      error: true,
      status: 'FAILED',
      code: 500,
      message: err,
    });
  }
};

/**
 * @routes DELETE api/user/{id}
 * @desc Delete user
 * @access public
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user._id;

    //Make sure the passed id is that of the logged in user
    if (user_id.toString() !== id.toString())
      return res.status(401).json({
        message: "Sorry, you don't have the permission to delete this user.",
      });
    const user = await Users.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      data: {
        code: 200,
        message: 'User has been deleted',
        data: user._id,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      status: 'FAILED',
      code: 500,
      message: err,
    });
  }
};

exports.details = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.sendStatus(401);
    const author = user.firstname + ' ' + user.lastname;
    const userPosts = await Posts.find({ author });
    const userTips = await Tips.find({ author });
    const pendingPosts = await PendingArticles.find({ author });
    const rejectedPosts = await RejectedArticles.find({ author });
    const notification = await Notifications.findOne({ author });
    res.status(200).json({
      user,
      posts: userPosts,
      tips: userTips,
      pending: pendingPosts,
      rejected: rejectedPosts,
      notification,
    });
  } catch (err) {
    res.status(500).json({ status: 'FAILED', code: 500, message: err.message });
  }
};

exports.showAlerts = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.sendStatus(401);
    const author = user.firstname + ' ' + user.lastname;
    const notification = await Notifications.findOne({ author });
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ status: 'FAILED', code: 500, message: err.message });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const user = req.user;

    if (!user) return res.sendStatus(401);
    const { index } = req.body;
    const author = user.firstname + ' ' + user.lastname;
    const notification = await Notifications.findOne({ author });
    const alerts = notification.alerts;
    // await Notifications.updateOne(
    //   { author },
    //   { $pull: { alerts: alerts[index] } },
    // );

    for (let i = 0; i < alerts.length; i++) {
      i = alerts[index];
      if (i === alerts[index]) {
        alerts.splice(i, 1);
        await notification.save();
      }
    }
    res
      .status(200)
      .json({ message: `Alert #${index} has been deleted successfully` });
  } catch (err) {
    res.status(500).json({ status: 'FAILED', code: 500, message: err.message });
  }
};
