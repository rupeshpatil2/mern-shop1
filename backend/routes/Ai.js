const express = require('express');
const { chatWithAi } = require('../controllers/Ai');
const router = express.Router();

router.post('/chat', chatWithAi);

module.exports = router;
