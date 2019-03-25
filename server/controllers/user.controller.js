const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.age = req.body.age;
    user.locality = req.body.locality.toLowerCase();
    var int = req.body.interest.toLowerCase().split(",");
    user.interest = int;
    user.password = req.body.password;
    user.status =  req.body.status;
    // console.log('Type of interest ', user);
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) {
            console.log("authenticating ",req.body);
            User.updateOne(
                {"email":user.email},
                {"$set":{"status":true}},
                function (err, res) {
                    if (err) throw err;
                    console.log(res);
                });
            return res.status(200).json({ "token": user.generateJwt() });
        }
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.logout = (req, res, next) => {
    console.log("logging out ",req.params);
    User.updateOne(
        {_id:req.params._id},
        {$set:{status:false}},
        function (err,res) {
            if (err) throw err;
            // console.log(res);
        });
    return res.status(200).json({status:true, message:'User logged out'});
}

module.exports.userProfile = (req, res, next) =>{
    console.log(req._id);
    User.findOne({ _id: req._id },
        // console.log(_id);
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['_id','fullName','email','age','locality','interest']) });
        }
    );
}

module.exports.suggestProfile = (req, res, next) =>{
    console.log("suggesting profile ... ", req.params);
    User.findOne({ _id: req.params._id }).then(function (results){
        console.log("then work ",results.age, typeof results.age);
            User.aggregate([
                {
                    "$match": {
                        "_id": {"$ne": results._id},
                        // "status": true,
                        "$or": [
                            {"interest": {"$in": results.interest}},
                            {"age": {"$gte": results.age - 5,"$lte":results.age + 5}},
                            {"locality": results.locality}
                        ]
                    },
                },
                {
                    "$project": {
                        "fullName": 1,
                        "age": 1,
                        "ageDiff": {"$abs": {"$subtract":["$age",results.age]}},
                        "locality": 1,
                        "interest": 1,
                        "common": {
                            "$size": {
                                "$setIntersection": ["$interest", results.interest]
                            }
                        },
                    },
                },
                {
                    "$sort": {common:-1,ageDiff:1}
                }
            ], (err, doc) => {
                // console.log('suggest profile error ', doc);
                if (!doc){
                    console.log('res is not correct');
                    return res.status(404).json({ status: false, message: 'User record not found.' });
                }
                else{
                    // console.log('suggest profile called ', doc);
                    return res.send(doc);
                }
            });
        })
        .catch(function(e) {
            console.log('error', e);
            res.status(400).send(e);
        });

}
