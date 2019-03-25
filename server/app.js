require('./config/config');
require('./models/db');
require('./config/passportConfig');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const rtsIndex = require('./routes/index.router');
const rtsChat = require('./routes/chat.router');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


// app.use(express.static(path.join(__dirname+'/public/')));
// console.log(path.join(__dirname+'/public'));

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsIndex);
app.use('/api/chat', rtsChat);

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});

// start server
server.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));


// socket io
io.on('connection', function (socket) {
    console.log('User connected');
    socket.on('disconnect', function() {
        console.log('User disconnected');
    });
    socket.on('save-message', function (data) {
        console.log("save-message ",data);
        io.emit('new-message', { message: data });
    });
});
