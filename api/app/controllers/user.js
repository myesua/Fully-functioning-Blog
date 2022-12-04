const Users = require('../models/User');
const Posts = require('../models/Post');
const Tips = require('../models/Tip');
const Categories = require('../models/Category');

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
      data: {
        code: 500,
        message: 'Server Error',
        data: err,
      },
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
    const cookie = req.cookies['UserSession'];
    const user = DecodeJWT(cookie);
    const user_id = user.id.toString();

    const { role, password, profilePicture, ...update } = req.body;

    const fetchUser = await Users.findById(id);
    const author = fetchUser.firstname + ' ' + fetchUser.lastname;

    if (user_id !== id.toString())
      return res.status(401).json({
        error: true,
        code: 401,
        message: 'You are not allowed to update this user',
      });

    //if there is no image, return success message
    if (!req.body.profilePicture) {
      const user = await Users.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true },
      );
      const updatedAuthor = user.firstname + ' ' + user.lastname;
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
      }

      return res.status(200).json({ user, message: 'User has been updated' });
    }

    // Attempt to upload to cloudinary
    const result = await uploader(req.body.profilePicture);

    const user_ = await Users.findByIdAndUpdate(
      id,
      { $set: { profilePicture: result.secure_url, ...update } },
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
    }
    await Posts.updateMany(
      { author: updatedAuthor },
      { $set: { avatar: result.secure_url } },
    );
    await Tips.updateMany(
      { author: updatedAuthor },
      { $set: { avatar: result.secure_url } },
    );
    await Categories.updateMany(
      { author: updatedAuthor },
      { $set: { avatar: result.secure_url } },
    );

    return res.status(200).json({
      user: user_,
      message: 'User has been updated',
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      data: {
        code: 500,
        message: 'Server Error',
        data: err,
      },
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
    const user_id = req.user._id.toString();

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
      data: {
        code: 500,
        message: 'Server Error',
        data: err,
      },
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
      data: {
        code: 500,
        message: 'Server Error',
        data: err,
      },
    });
  }
};

exports.details = async (req, res) => {
  const cookie = req.cookies['UserSession'];
  const user = DecodeJWT(cookie);
  const author = user.firstname + ' ' + user.lastname;
  const userPosts = await Posts.find({ author });
  const userTips = await Tips.find({ author });
  res.status(200).json({ user, posts: userPosts, tips: userTips });
};

const DecodeJWT = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};
