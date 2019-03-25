const mongoose = require('mongoose');
const _ = require('lodash');

const Chat = mongoose.model('Chat');

/* GET ALL CHATS */
module.exports.room = (req, res, next)=>{
    Chat.find({ room: req.params.room }, function (err, chats) {
        if (err) return next(err);
        res.json(chats);
    });
}

/*Save Chat*/
module.exports.saveToDb = (req,res, next) => {
    Chat.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
}