const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Token = require('./Token');

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: 'Your firstname is required',
      max: 100,
    },
    lastname: {
      type: String,
      required: 'Your lastname is required',
      max: 100,
    },
    email: {
      type: String,
      required: 'Your email address is required',
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: 'Your password is required',
      select: false,
      max: 100,
    },
    phone: {
      type: String,
      required: false,
      max: 20,
    },
    url: {
      type: String,
      required: false,
      max: 40,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      default: 'Author',
      required: false,
      max: 20,
    },
    bio: {
      type: String,
      required: false,
      max: 255,
    },
    profilePicture: {
      type: String,
      default:
        'https://res.cloudinary.com/doh3f4dzw/image/upload/v1667749613/defaultavatar_ipxcxq.png',
      max: 255,
    },
  },
  { timestamps: true },
);

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

// UserSchema.methods.comparePassword = (password) => {
//   return bcrypt.compare(password, this.password);
// };

UserSchema.methods.generateAccessJWT = function () {
  let payload = {
    id: this._id,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
};

UserSchema.methods.generateRefreshJWT = function () {
  let payload = {
    id: this._id,
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1h',
  });
};

UserSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // expires in ten minutes
};

UserSchema.methods.generateVerificationToken = function () {
  let payload = {
    _id: this._id.toString(),
    token: crypto.randomBytes(20).toString('hex'),
  };

  return new Token(payload);
};

module.exports = mongoose.model('User', UserSchema);
