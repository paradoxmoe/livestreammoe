var express = require('express');
var router = express.Router();
var users = require('../schemas/usersData.js');

router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/register', function (req, res, next) {
    res.render('register');
})

router.get('/login', function (req, res, next) {
    res.render('login')
})

router.get('/user/:user', function (req, res, next){
    var user = req.params.user.toLowerCase();

    var usersQuery = users.findOne({ "username" : user})
                        .select('usernameAsTyped')
                        .exec(function(err, users) {
                            if(users == null) {
                                res.send("User does not exist");
                            } else {
                                res.send(users.usernameAsTyped + " exist!")
                            }
                        })
})

module.exports = router;