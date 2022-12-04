const Tips = require('../models/Tip');

/**
 * @route POST tips/
 * @desc Create a new tip
 * @access public
 */
exports.create = async (req, res) => {
  const newTip = new Tips({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    slug: req.body.title.toLowerCase().split(' ').join('-').replace(/\?/g, ''),
    banner: req.body.banner,
    categories: req.body.categories,
    readingTime: req.body.readingTime,
    author: req.body.author,
    avatar: req.body.avatar,
  });
  try {
    if (!req.user)
      return res.status(401).json({ message: 'You must be logged in' });
    const savedTip = await newTip.save();
    return res
      .status(201)
      .json({ message: 'Tip created successfully!', data: savedTip });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route PUT tips/:id
 * @desc Update a tip
 * @access public
 */
exports.update = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: 'You are not permitted to perform this action' });

    const userName = req.user.firstname + ' ' + req.user.lastname;
    const tipToBeUpdated = await Tips.findById(req.params.id);
    const tipAuthor = tipToBeUpdated.author;

    if (userName !== tipAuthor)
      return res
        .status(401)
        .json({ message: 'You are not allowed to update this tip' });
    const updatedTip = await Tips.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    return res.status(200).json({
      message: 'Tip updated successfully!',
      data: updatedTip,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route GET tips/:id
 * @desc Get a tip
 * @access public
 */
exports.view = async (req, res) => {
  try {
    const tip = await Tips.findById(req.params.id);
    return res.status(200).json({
      message: 'Tip retrieved successfully!',
      data: tip,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route GET tips/:slug
 * @desc Read a tip
 * @access public
 */
exports.readBySlug = async (req, res) => {
  try {
    const tip = await Tips.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true },
    );

    return res.status(200).json({
      message: 'Tip retrieved successfully!',
      tip,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route DELETE tips/:id
 * @desc Delete a tip
 * @access public
 */
exports.delete = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: 'You are not allowed to perform this function.' });

    const userName = req.user.firstname + ' ' + req.user.lastname;
    const tipToBeDeleted = await Tips.findById(req.params.id);
    const tipAuthor = tipToBeDeleted.author;

    if (userName !== tipAuthor)
      return res
        .status(401)
        .json({ message: 'You are not allowed to delete this tip.' });
    await tipToBeDeleted.delete();
    return res.status(200).json({
      message: 'Tip deleted successfully!',
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route GET tips/
 * @desc Get all tips (by author, category, search)
 * @access public
 */
exports.show = async (req, res) => {
  const author = req.query.user;
  const catName = req.query.cat;
  try {
    let tips;
    if (author) {
      tips = await Tips.find({ author }).sort({ createdAt: -1 });
    } else if (catName) {
      tips = await Tips.find({
        categories: {
          $in: [catName],
        },
      }).sort({ createdAt: -1 });
    } else {
      tips = await Tips.find();
    }
    if (tips == '') {
      return res.status(200).json({
        message:
          'No posts found for this query. You may need to check your entries.',
        tips: 'You have made no tip post! Whenever you make a new post, it will be added here.',
      });
    }
    return res
      .status(200)
      .json({ message: 'Tips retrieved successfully!', tips });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
