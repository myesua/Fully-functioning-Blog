const Posts = require('../models/Post');

/**
 * @route POST posts/
 * @desc Create a new post
 * @access public
 */
exports.create = async (req, res) => {
  const newPost = new Posts({
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
    const savedPost = await newPost.save();
    return res
      .status(201)
      .json({ message: 'Post created successfully!', data: savedPost });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route PUT posts/:id
 * @desc Update a post
 * @access public
 */
exports.update = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: 'You are not allowed to perform this action' });

    const userName = req.user.firstname + ' ' + req.user.lastname;
    const postToBeUpdated = await Posts.findById(req.params.id);
    const postAuthor = postToBeUpdated.author;

    if (userName !== postAuthor)
      return res
        .status(401)
        .json({ message: 'You are not allowed to update this post.' });
    const updatedPost = await Posts.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    return res.status(200).json({
      message: 'Post updated successfully!',
      data: updatedPost,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route GET posts/:id
 * @desc Get a post
 * @access public
 */
exports.view = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    return res.status(200).json({
      message: 'Post retrieved successfully!',
      data: post,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route GET posts/:slug
 * @desc Read a post
 * @access public
 */
exports.readBySlug = async (req, res) => {
  try {
    const post = await Posts.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true },
    );
    return res.status(200).json({
      message: 'Post retrieved successfully!',
      post,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route DELETE posts/:id
 * @desc Delete a post
 * @access public
 */
exports.delete = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: 'You are not allowed to perform this function.' });

    const userName = req.user.firstname + ' ' + req.user.lastname;
    const postToBeDeleted = await Posts.findById(req.params.id);
    const postAuthor = postToBeDeleted.author;

    if (userName !== postAuthor)
      return res
        .status(401)
        .json({ message: 'You are not allowed to delete this post.' });
    await postToBeDeleted.delete();
    return res.status(200).json({
      message: 'Post deleted successfully!',
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @route GET posts/
 * @desc Get all posts (by author, category, search)
 * @access public
 */
exports.show = async (req, res) => {
  const author = req.query.user;
  const catName = req.query.cat;
  const search = req.query.search;
  try {
    let posts;
    if (author) {
      posts = await Posts.find({ author }).sort({ createdAt: -1 });
    } else if (catName) {
      posts = await Posts.find({
        categories: {
          $in: [catName],
        },
      }).sort({ createdAt: -1 });
    } else if (search) {
      // find documents based on query and projection
      const agg = [
        {
          $search: {
            autocomplete: {
              path: 'title',
              query: search,
              tokenOrder: 'any',
              fuzzy: {
                maxEdits: 2,
                prefixLength: 1,
                maxExpansions: 256,
              },
            },
            highlight: {
              path: 'title',
            },
          },
        },
        {
          $limit: 3,
        },
        {
          $project: {
            _id: 0,
            title: 1,
            description: 1,
            visits: 1,
            createdAt: 1,
            readingTime: 1,
            slug: 1,
            highlights: {
              $meta: 'searchHighlights',
            },
          },
        },
      ];
      const result = await Posts.aggregate(agg);
      if (result == '') {
        return res.status(200).json({
          message:
            'No posts found for this query. Kindly check your entries, you may need to add more characters',
        });
      }
      return res.status(200).json(result);
    } else {
      posts = await Posts.find();
    }
    if (posts == '') {
      return res.status(200).json({
        message:
          'No posts found for this query. You may need to check your entries.',
        posts:
          'You have made no post! Whenever you make a new post, it will be added here.',
      });
    }
    res.status(200).json({ message: 'Posts retrieved successfully!', posts });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
