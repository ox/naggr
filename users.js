var couch = require('couch-client');
var db = couch('http://Llama51:dapopo@moxie.iriscouch.com/naggr');

/*
::Example Usage
authenticate('jon','lol',function(user){
	if(user) {
		console.log('retrieved user: ' + user.login);
	}
});

::Example of returned
{ _id: 'users/artem.titoulenko@gmail.com',
  _rev: '1-fe3a6f8f56f8b477b5d7ca53549a729c',
  login: 'artem.titoulenko@gmail.com',
  password: 'lol' }
*/

var log = console.log;

module.exports.authenticate = function(login,password,callback) {
	db.get('users/'+login,function(err,doc){
		if(err) { log(err.message); callback(null); return;}
		
		if(doc == null) { callback(null); return; }
		if(doc.password == password) { callback(doc); return; }
		log('retrieved: ' + doc); callback(null);
	});
}
