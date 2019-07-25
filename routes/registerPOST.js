//.replace(/[^A-Za-z0-9-_]/gi, '')
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');

var usersData = require("../schemas/usersData.js")

var regexSpecialChars = new RegExp(/[^A-Za-z0-9-_]/gi);


router.post('/', function(req, res, next) {

    if(req.body.username.length < 3 || req.body.username.length > 20) {
        //err = new Error("Username length too short");
        res.send("Username is an incorrect length <br> <a href='../register'>Click to go back</a>");
    } else if(req.body.password.length < 6 || req.body.password.length > 100) {
        //err = new Error("Password length too short");
        res.send("Password is an incorrect length <br> <a href='../register'>Click to go back</a>");
    } else if ((regexSpecialChars.test(req.body.username) == true) || (regexSpecialChars.test(req.body.password) == true)){
        res.send("<b style='color:red;'>Special Characters, excluding dashes and underscores, can not be used in the username or password fields.</b> <br> <a href='../register'>Click to go back</a>");
    } else if(req.body.username.toLowerCase() == 'undefined'){
        res.send("Banned Username <br> <a href='../register'>Click to go back</a>")
    } else {
        var sha256Hash = crypto.createHash('sha256');
        var salt = crypto.randomBytes(256).toString('base64');

        sha256Hash.update(sha256Hash.update(req.body.password.replace(/[^A-Za-z0-9-_]/gi, ''), 'ascii') + salt, 'ascii');
        var hash = sha256Hash.digest("base64");
        
        var streamKey = encodeURIComponent(crypto.randomBytes(16).toString('hex'));

        var newUser = new usersData({
            _id		: mongoose.Types.ObjectId(),
            username : req.body.username.toLowerCase(),
            usernameAsTyped: req.body.username,
            salt: salt,
            password: hash,
            streamKey: streamKey,
        })

        newUser.save(function(err, doc) {
            if(err) {
                if(err.code == 11000) {
                    res.send("User already exist.")
                } else {
                    res.send("There was an error.");
                }
            } else {
                res.send("User successfully created!");
            }
        })
    }
})

module.exports = router;