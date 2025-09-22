const express = require('express');
const router = express.Router();
const Setting = require('../models/settingModel');

// Save settings
router.post('/save', async (req, res) => {
  try {
    const { name, email, business } = req.body;
    const newSetting = new Setting({ name, email, business });
    await newSetting.save();
    res.status(201).json({ message: 'Settings saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
