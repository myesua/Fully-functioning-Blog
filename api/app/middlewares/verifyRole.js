const verifyRole = (req, res, next) => {
  const { role } = req.user;
  if (role !== 'Super Admin')
    return res.status(401).json({
      status: 'error',
      code: 401,
      data: {
        message: 'You are not allowed to do this.',
      },
    });

  next();
};

module.exports = verifyRole;
