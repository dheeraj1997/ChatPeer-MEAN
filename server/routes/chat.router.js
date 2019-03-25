const express = require('express');
const router = express.Router();

const ctrlChat = require('../controllers/chat.controller');

/*Chat routes*/
router.get('/:room',ctrlChat.room);
router.post('/',ctrlChat.saveToDb);

module.exports = router;
