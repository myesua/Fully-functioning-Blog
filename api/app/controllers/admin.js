const Users = require('../models/User');
const Posts = require('../models/Post');
const Pending = require('../models/Pending');
const Tips = require('../models/Tip');
const Notification = require('../models/Notification');
const Rejected = require('../models/Rejected');

/**
 * @routes GET api/user
 * @desc Returns all users if request is from a Super Admin account
 * @access private
 */
exports.index = async (req, res) => {
  try {
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
 * @routes GET /users/post/pending:id
 * @desc Gets pending post for review and approves
 * @private
 */

exports.approve = async (req, res) => {
  try {
    const { id } = req.params;
    const pendingPost = await Pending.findById(id);
    const newPost = new Posts({
      title: pendingPost.title,
      description: pendingPost.description,
      content: pendingPost.content,
      slug: pendingPost.slug,
      banner: pendingPost.banner,
      categories: pendingPost.categories,
      readingTime: pendingPost.readingTime,
      author: pendingPost.author,
      avatar: pendingPost.avatar,
    });
    const approvedPost = await newPost.save();

    const author = pendingPost.author;

    const notification = await Notification.findOne({
      author: author,
    });

    if (!notification) {
      const nT = new Notification({
        alerts: {
          title: 'Update on Article',
          text: `Your article titled - '${pendingPost.title}' has been approved. It is now visible on the blog site.`,
        },
        author: author,
      });
      await nT.save();
    } else {
      notification.pushNotification({
        title: 'Update on Article',
        text: `Your article titled - '${pendingPost.title}' has been approved. It is now visible on the blog site.`,
      });
      await notification.save();
    }

    pendingPost.deleteOne();
    res.status(200).json({ data: approvedPost, message: 'Post approved' });
  } catch (err) {
    res.status(500).json({
      status: 'FAILED',
      code: 500,
      message: err.message,
    });
  }
};

/**
 * @routes GET /users/post/reject:id
 * @desc Gets pending post for review and rejects (/add reason for rejection later)
 * @private
 */

exports.reject = async (req, res) => {
  try {
    const { id } = req.params;
    const pendingPost = await Pending.findById(id);

    const rejectedPost = new Rejected({
      title: pendingPost.title,
      description: pendingPost.description,
      content: pendingPost.content,
      slug: pendingPost.slug,
      banner: pendingPost.banner,
      categories: pendingPost.categories,
      readingTime: pendingPost.readingTime,
      author: pendingPost.author,
      avatar: pendingPost.avatar,
    });
    const author = pendingPost.author;

    const notification = await Notification.findOne({
      author: author,
    });
    if (!notification) {
      const nT = new Notification({
        alerts: {
          title: 'Update on Article',
          text: `Your article titled - '${pendingPost.title}' was not approved, as it does not meet the standard requirements. If you have any further questions, please contact admin.`,
        },
        author: author,
      });
      await nT.save();
    } else {
      notification.pushNotification({
        title: 'Update on Article',
        text: `Your article titled - '${pendingPost.title}' was not approved, as it does not meet the standard requirements. If you have any further questions, please contact admin.`,
      });
      await notification.save();
    }
    await rejectedPost.save();
    pendingPost.deleteOne();
    res.status(200).json({
      data: rejectedPost,
      message: 'Article not approved!',
    });
  } catch (err) {
    res.status(500).json({
      status: 'FAILED',
      code: 500,
      message: err.message,
    });
  }
};

exports.retrieve = async (req, res) => {
  try {
    const pending = await Pending.find();
    res.status(200).json({ message: 'SUCCESS', pending });
  } catch (err) {
    res.status(500).json({ status: 'FAILED', code: 500, message: err.message });
  }
};
