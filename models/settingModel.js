const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  name: String,
  email: String,
  business: String
});

const Setting = mongoose.model('Setting', settingSchema);
module.exports = Setting;
