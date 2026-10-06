// src/routes/whatsappBotRoutes.js
const express = require('express');
const router = express.Router();
const { processParentWhatsAppMessage } = require('../services/whatsappBotService');

// Webhook simulation / Receiver for parent WhatsApp incoming messages
router.post('/webhook', async (req, res) => {
  try {
    const { from = '+91 9847100000', message = 'MENU' } = req.body;
    const response = await processParentWhatsAppMessage(from, message);
    return res.json({ success: true, response });
  } catch (err) {
    console.error('WhatsApp Bot Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
