var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var usersDataSchema = new Schema({
    _id		: Schema.Types.ObjectId,
    username : String,
    usernameAsTyped: String,
    salt: String,
    password: String,
    streamKey: String,
    streamKeyPublic: String,	
});

var usersData = mongoose.model('users', usersDataSchema);

module.exports = usersData;