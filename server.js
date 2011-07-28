//ExpressJS
var express = require('express');
var app = express.createServer();

//CouchDB
var couch = require('couch-client'),
		db = couch('http://Llama51:dapopo@moxie.iriscouch.com/naggr');
		
//auth
var users = require('./users')

// set rendering views
app.set('views',__dirname + '/views');
app.set('view engine','jade');
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static(__dirname + '/public'));

var MemoryStore = require('connect').session.MemoryStore;
app.use(express.session({ 
	secret: "this is fun SADAS SAD sad wsgada zxb as fun as $%^@21**!~5./)(213]{})",
	store: new MemoryStore({repInterval: 60000 * 10})
}));

app.dynamicHelpers(
	{
		session: function(req,res) {
			return req.session;
		},
		flash: function(req,res) {
			return req.flash();
		}
	}
);

/* Sessions */
// ============================================================================
app.get('/sessions/new',function(req,res){
	res.render('sessions/new.jade',{locals: { redirect: req.query.redir }, layout: false});
});

app.get('/sessions',function(req,res){
	res.redirect('/sessions/new');
});

app.post('/sessions',function(req,res){
	users.authenticate(req.body.login, req.body.password,function(user){
		if(user) {
			req.session.user = user;
			res.redirect('/backbone');
		} else {
			res.render('sessions/new.jade',{locals: { redirect: req.body.redir}, layout: false});
		}
	});
});

app.get('/sessions/destroy',function(req,res){
	delete req.session.user;
	res.redirect('/');
});

// Call this as middleware in order to require Authentication
function reqAuth(req,res,next) {
	if(req.session.user != null) {
		next();
	} else {
		res.render('sessions/new.jade', {layout: false});
	}
};

// ============================================================================


app.get('/',function(req,res){
	res.render('main',{layout: false})
});

app.get('/backbone',  function(req,res){
  res.render('backbone',{layout: false});
});

app.listen(3001);