const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');


console.log('router accessed');
router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/logout/:_id', ctrlUser.logout);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.get('/suggestProfile/:_id', ctrlUser.suggestProfile);

router.get('/chatroom', function(req, res, next) {
    res.send('Express REST API');
});

module.exports = router;



