const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema(
  {
    alerts: {
      type: Array,
      required: false,
    },
    author: {
      type: String,
      ref: 'User',
    },
  },
  { timestamps: true },
);

AlertSchema.methods.pushNotification = function ({ title, text }) {
  this.alerts.push({ title, text });
};

module.exports = mongoose.model('Alert', AlertSchema);
