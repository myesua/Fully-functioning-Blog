const mongoose = require('mongoose');

const RejectedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: { type: String, required: true },
    banner: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    categories: { type: Array, lowercase: true, required: false },
    content: { type: {}, required: true },
    readingTime: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Rejected', RejectedSchema);
