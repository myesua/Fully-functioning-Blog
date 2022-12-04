const auth = require('./auth');
const user = require('./user');
const account = require('./account');
const post = require('./post');
const tip = require('./tip');
const category = require('./category');

const authController = require('../controllers/auth');

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
  // app.all('*', authController.checkAccess);
  // app.all('*', async (req, res) => {
  //   const token = res;
  //   console.log(res);
  // });
  app.use('/api/auth', auth);
  app.use('/api/user', user);
  app.use('/api/account', account);
  app.use('/api/posts', post);
  app.use('/api/tips', tip);
  app.use('/api/categories', category);

  app.post('/logout', (req, res, next) => {
    if (req.session) {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
        // res.status(200).send({
        //   success: true,
        //   message: 'Logged out successfully!',
        // });
      });
    }
  });
};
