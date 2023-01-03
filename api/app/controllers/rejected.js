const Rejected = require('../models/Rejected');
const Pending = require('../models/Pending');

/**
 * @route PUT rejected/:id
 * @desc Update a rejected article and resubmit
 * @access public
 */
exports.update = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: 'You are not permitted to perform this action' });

    const userName = req.user.firstname + ' ' + req.user.lastname;
    const articleToBeUpdated = await Rejected.findById(req.params.id);
    const articleAuthor = articleToBeUpdated.author;

    if (userName !== articleAuthor)
      return res
        .status(401)
        .json({ message: 'You are not allowed to update this article' });
    const updatedArticle = await Rejected.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    const newArticle = new Pending({
      title: updatedArticle.title,
      description: updatedArticle.description,
      content: updatedArticle.content,
      slug: updatedArticle.title
        .toLowerCase()
        .split(' ')
        .join('-')
        .replace(/\?/g, ''),
      banner: updatedArticle.banner,
      categories: updatedArticle.categories,
      readingTime: updatedArticle.readingTime,
      author: updatedArticle.author,
      avatar: updatedArticle.avatar,
      type: updatedArticle.type,
    });
    const savedArticle = await newArticle.save();
    updatedArticle.deleteOne();
    return res.status(200).json({
      message: 'Article updated and re-submitted successfully!',
      data: savedArticle,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route GET rejected/:id
 * @desc Get an article
 * @access public
 */
exports.view = async (req, res) => {
  try {
    const article = await Rejected.findById(req.params.id);
    return res.status(200).json({
      message: 'Article retrieved successfully!',
      article,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route GET rejected/:slug
 * @desc Read an article
 * @access public
 */
exports.readBySlug = async (req, res) => {
  try {
    const article = await Rejected.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true },
    );

    return res.status(200).json({
      message: 'Article retrieved successfully!',
      article,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route DELETE rejected/:id
 * @desc Delete an article
 * @access public
 */
exports.delete = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: 'You are not allowed to perform this function.' });

    const userName = req.user.firstname + ' ' + req.user.lastname;
    const articleToBeDeleted = await Rejected.findById(req.params.id);
    const articleAuthor = articleToBeDeleted.author;

    if (userName !== articleAuthor)
      return res
        .status(401)
        .json({ message: 'You are not allowed to delete this article.' });
    await articleToBeDeleted.delete();
    return res.status(200).json({
      message: 'Article deleted successfully!',
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route GET rejected/
 * @desc Get all articles
 * @access public
 */
exports.show = async (req, res) => {
  try {
    const articles = await Rejected.find();

    return res
      .status(200)
      .json({ message: 'Tips retrieved successfully!', articles });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
