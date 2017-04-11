
/**
* Module dependencies.
*/
var express = require('express'), routes = require('./routes');
var app = module.exports = express.createServer();

var crypto = require('crypto');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var session = require('express-session');
var flash = require('connect-flash');

app.configure(function(){
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(session({
        secret: settings.cookie_secret,
        store: new MongoStore({
        db : settings.db,
        })
      }));
app.use(app.router);
app.use(express.static(__dirname + '/public'));
});

app.use(flash());


// Routes
app.get('/', routes.index);
app.get('/hello', routes.hello);
app.get('/user/:username', function(req, res) {
  res.send('user: ' + req.params.username);
});

app.get('/home', routes.home);
app.get('/voteresult',routes.voteresult);
app.post('/voteresult',routes.doVoteresult);
app.get('/voteresult1',routes.voteresult);
app.post('/voteresult1',routes.doVoteresult);
app.get('/vote', routes.vote);
app.post('/vote', routes.doVote);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/reg1', routes.reg1);
app.post('/reg1', routes.doReg1);
app.get('/repassword', routes.repassword);
app.post('/repassword', routes.dorepassword);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/managevoter', routes.managevoter);
app.get('/makevoteraddress', routes.makevoteraddress);
app.post('/votestart',routes.votestart);
app.post('/votestop',routes.votestop);
app.get('/logout', routes.logout);


app.use(function(req, res, next){
   console.log("app.usr local");
   res.locals.user = req.session.user;
   res.locals.post = req.session.post;
   var error = req.flash('error');
   res.locals.error = error.length ? error : null;
  
   var success = req.flash('success');
   res.locals.success = success.length ? success : null;
 next();
});

/*
app.dynamicHelpers({
  user: function(req, res) {
    return req.session.user;
  },
  error: function(req, res) {
    var err = req.flash('error');
    if (err.length)
      return err;
    else
      return null;
  },
  success: function(req, res) {
    var succ = req.flash('success');
    if (succ.length)
      return succ;
    else
      return null;
  },
});
*/

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port,
app.settings.env);
