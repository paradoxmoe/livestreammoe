const dotenv = require('dotenv');
dotenv.config()

var app = require('express')();
var expHB = require ('express-handlebars');
var session = require('express-session')
var mongoStore = require('connect-mongo')(session);

var http = require('http');
var server = http.createServer(app);
var path = require('path');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

var routes = require('./routes/index');
var registerPOST = require('./routes/registerPOST');
var loginPOST = require('./routes/loginPOST');
var rtmpLogin = require('./routes/rtmpLogin');


var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_DATABASE,  {useNewUrlParser: true})

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expHB({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')


app.use(session({
    store: new mongoStore({ mongooseConnection: mongoose.connection }),
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: true,	
    cookie: {secure: true}
}));

app.use('/', routes);
app.use('/register/post', registerPOST)
app.use('/login/post', loginPOST)
app.use('/rtmpLogin', rtmpLogin)

server.listen(process.env.PORT || 8080);
console.log("Server is listening on port: " + process.env.PORT || 8080)