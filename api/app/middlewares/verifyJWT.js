const jwt = require('jsonwebtoken');
const Users = require('../models/User');

const verifyJWT = (req, res, next) => {
  // const authHeader = req.headers['authorization'];
  const authHeader = req.headers['cookie'];

  if (!authHeader) return res.sendStatus(401);
  const access = authHeader.split('=')[1];
  const token = access.split(';')[0];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      // delete authHeader;
      return res.sendStatus(403);
    }
    const { id } = decoded;
    const user = await Users.findById(id);
    const { password, ...data } = user._doc;
    req.user = data;
    next();
  });
};

module.exports = verifyJWT;
