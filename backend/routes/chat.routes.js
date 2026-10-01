const router = require('express').Router();
const { sendMessage, findAnswer } = require('../controllers/chat.controller');
const validateMessage = require('../middleware/chat/validateMessage');

router.post('/sendMessage', validateMessage, sendMessage);

router.post("/findAnswer", validateMessage, findAnswer);

module.exports = router;