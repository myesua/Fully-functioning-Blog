const auth = require('./auth');
const user = require('./user');
const admin = require('./admin');
const post = require('./post');
const tip = require('./tip');
const pending = require('./pending');
const rejected = require('./rejected');
const category = require('./category');

const verify = require('../middlewares/verifyJWT');
const verifyRole = require('../middlewares/verifyRole');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.status(200).send({
      success: true,
      data: {
        code: 200,
        message:
          'Welcome to the AUTHENTICATION API! Register or Login for Authentication.',
        data: {},
      },
    });
  });
  app.use('/api/auth', auth);
  app.use('/api/user', verify, user);
  app.use('/api/admin', verify, verifyRole, admin);
  app.use('/api/posts', post);
  app.use('/api/tips', tip);
  app.use('/api/pending', verify, pending);
  app.use('/api/rejected', verify, rejected);
  app.use('/api/categories', category);
};
