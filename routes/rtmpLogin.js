//.replace(/[^A-Za-z0-9-_]/gi, '')
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');

var usersData = require("../schemas/usersData.js")

var regexSpecialChars = new RegExp(/[^A-Za-z0-9-_]/gi);

router.post('/', function(req, res, next) {
    console.log(req.body.name);

			var usersQuery = usersData.findOne({'streamKey' : req.body.name.toLowerCase()})
							.select('username streamKey')
							.exec(function(err, users){
				//console.log('username: %s salt: %s', users.username, users.salt);
				if(users == null) {
					res.sendStatus(404);
				} else if(typeof users != null &&  users != 'undefined'){
					res.redirect('/' + users.username);
				}
			});    
})

module.exports = router;