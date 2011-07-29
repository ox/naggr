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
app.set('view options', {
  layout: false
});

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
// ============================================================================
app.get('/sessions/new',function(req,res){
	res.render('sessions/new.jade',{locals: { redirect: req.query.redir }});
});

app.get('/sessions',function(req,res){
	res.redirect('/sessions/new');
});

app.post('/sessions',function(req,res){
	users.authenticate(req.body.login, req.body.password,function(user){
		if(user) {
		  console.log('user')
			req.session.user = user;
			res.redirect('/backbone');
		} else {
		  console.log('bad combo')
			res.render('sessions/new.jade',{locals: { redirect: req.body.redir}});
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
		res.render('sessions/new.jade');
	}
};
// ============================================================================
// ============================================================================

app.get('/',function(req,res){
	res.render('main',{locals: {flash: req.flash}})
});


app.post('/',function(req,res){
  db.get('users/'+req.body.email,function(err,doc){
    if(err) { //if no such key exists... lets make one
      db.save({
    		_id: 'users/'+req.body.email,
    		email: req.body.email,
    		role: 'user',
    		created_at: new Date().getTime()
    	},function(err,doc) { 
    		if(err) { throw err; }
    		else { 
    		  req.session.user = doc; //set the session so we're "logged in"
    			res.redirect('/backbone'); // go to our protected area. will change
    		}
    	});
    } else { 
      res.redirect('/sessions/new');
      //throw {name: 'UserAlreadExistsError', message: req.body.email+' already exists in our system. Try something else'};
    }
  });
});

app.get('/backbone',function(req,res){
  res.render('backbone',{locals: {email: req.session.user}});
});

app.listen(3001);