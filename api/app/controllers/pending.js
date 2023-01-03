const Pending = require('../models/Pending');

/**
 * @route POST a new pending/
 * @desc Create a new article
 * @access public
 */
exports.create = async (req, res) => {
  const newArticle = new Pending({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    slug: req.body.title.toLowerCase().split(' ').join('-').replace(/\?/g, ''),
    banner: req.body.banner,
    categories: req.body.categories,
    readingTime: req.body.readingTime,
    author: req.body.author,
    avatar: req.body.avatar,
    type: req.body.type,
  });

  try {
    if (!req.user)
      return res.status(401).json({ message: 'You must be logged in' });
    const savedArticle = await newArticle.save();
    return res
      .status(201)
      .json({ message: 'Article created successfully!', data: savedArticle });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route PUT pending/:id
 * @desc Update a article
 * @access public
 */
exports.update = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: 'You are not permitted to perform this action' });

    const userName = req.user.firstname + ' ' + req.user.lastname;
    const articleToBeUpdated = await Pending.findById(req.params.id);
    const articleAuthor = articleToBeUpdated.author;

    if (userName !== articleAuthor)
      return res
        .status(401)
        .json({ message: 'You are not allowed to update this article' });
    const updatedArticle = await Pending.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    return res.status(200).json({
      message: 'Article updated successfully!',
      data: updatedArticle,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route GET pending/:id
 * @desc Get an article
 * @access public
 */
exports.view = async (req, res) => {
  try {
    const article = await article.findById(req.params.id);
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
 * @route GET pending/:slug
 * @desc Read an article
 * @access public
 */
exports.readBySlug = async (req, res) => {
  try {
    const article = await Pending.findOneAndUpdate(
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
 * @route DELETE pending/:id
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
    const articleToBeDeleted = await Pending.findById(req.params.id);
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
 * @route GET pending/
 * @desc Get all articles
 * @access public
 */
exports.show = async (req, res) => {
  try {
    const articles = await Pending.find();

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
