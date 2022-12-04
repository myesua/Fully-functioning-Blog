const Categories = require('../models/Category');

/**
 * @route POST categories/
 * @desc Create a category
 * @access public
 */
exports.create = async (req, res) => {
  try {
    const author = req.user.firstname + ' ' + req.user.lastname;
    if (!req.user)
      return res.status(401).json({ message: 'You must be logged in' });
    if (req.user.role !== 'Super Admin')
      return res
        .status(401)
        .json({ message: 'You are not permitted to perform this action' });
    const newCategory = new Categories({
      name: req.body.name,
      author: author,
    });
    const savedCategory = await newCategory.save();
    return res.status(201).json({
      message: 'Category created successfully!',
      data: savedCategory,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route PUT categories/:id
 * @desc Update a category
 * @access public
 */
exports.update = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: 'You are not allowed to perform this action' });

    const userName = req.user.firstname + ' ' + req.user.lastname;
    const categoryToBeUpdated = await Categories.findById(req.params.id);
    const author = categoryToBeUpdated.author;
    if (userName !== author)
      return res
        .status(401)
        .json({ message: 'You are not allowed to update this category.' });
    const updatedCategory = await Categories.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    return res.status(200).json({
      message: 'Category updated successfully!',
      data: updatedCategory,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route DELETE categories/:id
 * @desc Delete a category
 * @access public
 */
exports.delete = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: 'You are not allowed to perform this action' });
    const userName = req.user.firstname + '' + req.user.lastname;
    const categoryToBeDeleted = await Categories.findById(req.params.id);
    const categoryAuthor = categoryToBeDeleted.author;

    if (userName !== categoryAuthor)
      return res
        .status(401)
        .json({ message: 'You are not allowed to delete this category.' });
    await categoryToBeDeleted.delete();
    return res.status(200).json({
      message: 'Category deleted successfully!',
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route GET categories/
 * @desc View all categories
 * @access public
 */
exports.view = async (req, res) => {
  try {
    const categories = await Categories.find();
    res.status(200).json({
      status: 'success',
      message: 'Categories fetched successfully',
      categories,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
