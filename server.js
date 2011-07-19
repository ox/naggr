//ExpressJS
var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);

//CouchDB
var couch = require('couch-client'),
		db = couch('http://Llama51:dapopo@moxie.iriscouch.com/naggr');
		
var miner = require('./miner');
var set_up = false;

// set rendering views
app.set('views',__dirname + '/views');
app.set('view engine','jade');
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static(__dirname + '/public'));

var root = io.of('/new')
  .on('connection',function(socket){
    miner.init(socket);
    //miner.parse_requests();
  });
  
app.get('/',function(req,res){
  res.redirect('/new');
});

app.get('/new',function(req,res){
	// db.save({
	// 		user: req.connection.remoteAddress,
	// 		action: 'visit',
	// 		date: Date()
	// 	}, function(err,doc){
	// 		if(err) console.log(err);
	// 	});
  
	res.render('main',{layout: false})
});

app.get('/nothing',function(req,res){
  res.render('main',{layout: false});
});

app.listen(3001);