const express = require('express');
const router = express.Router();
 
const llmService = require('../controller/llm-api');
 
router.post('/result', llmService.getResponse);

module.exports = router;