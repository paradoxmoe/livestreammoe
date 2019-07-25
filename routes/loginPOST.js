//.replace(/[^A-Za-z0-9-_]/gi, '')
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');

var usersData = require("../schemas/usersData.js")

var regexSpecialChars = new RegExp(/[^A-Za-z0-9-_]/gi);

router.post('/', function(req, res, next) {
    var sha256Hash = crypto.createHash('sha256');
			var usersQuery = usersData.findOne({'username' : req.body.username.toLowerCase()})
							.select('username usernameAsTyped salt password streamKey')
							.exec(function(err, users){
				//console.log('username: %s salt: %s', users.username, users.salt);
				if(users == null) {
					res.send('User does not exist');
				} else if(typeof users != null && typeof users != 'undefined'){
					sha256Hash.update(sha256Hash.update(req.body.password.replace(/[^A-Za-z0-9-_]/gi, ''), 'ascii') + users.salt, 'ascii');
					var hash = sha256Hash.digest("base64");
					
					if(users.password == hash) {
						req.session.name = users.username;
						req.session.usernameAsTyped = users.usernameAsTyped;
						res.send('Welcome, ' + users.usernameAsTyped + ". <br /> Your Stream Key is: " + users.streamKey);
					} else {
						res.send('Incorrect Password.' + "<br><a href='../login'>Click to go back</a>");
					}
				}
			});

})

module.exports = router;