const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      expires: '1200000',
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Token', TokenSchema);
