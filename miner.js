//CouchDB, to build out the project doc
var couch = require('couch-client'),
		db = couch('http://Llama51:dapopo@moxie.iriscouch.com/naggr');
		
/* 
##Basic Miner Usage##
var miner = require('./miner');
miner.drill(url,function(err,doc){
	db.save(doc,function(err,doc){
		if(err) console.log(err)
	});
});

##Idea##
Miner will deduce the service being mined from the URL.
We will work with the assumption that url's will include
the user name and the repo name.

the drill method will add stuff to the clients page, depending
on what info it needs. If it can't get an email from a repo page,
for instance, it will ask for an email. Then a phone number,
then tasks. At each stage it will verify what it wants and 
modify the clients code as necessary. 

when the proper data are recieved, the miner will return a doc
with all the information in a pseudo-structured manner, where there
sometimes exists more information than necessary, though 
only the essentials will be required. Ex:

doc = {
	'repo': 'github:ArtemTitoulenko/GoForth',
	'user': 'ArtemTitoulenko',
	'repo': 'GoForth',
	'email': 'artem.titoulenko@gmail.com',
	'phone': '9082173824',
	'tasks_tbc': [
		'make a data miner',
		'ensure the data miner works well',
		'make more adapters for more services',
		'make money'
	],
	'last_commit_before_salvation': '7638417db6d59f3c431d3e1f261cc637155684cd'
}
*/

/* data: {
  id: 'the requested piece of data'
}
*/

module.exports = (function(){
  var self = this;
  var socket;

  var find_tool_for = function(url,callback) {
    s = url.match(/(\w*?)(?:\.\w{2,})\/(.+)/);
    if(s != null) {
      self.socket.emit('good data', "#url");
      callback([s[1],s[2]]);
    } else {
      self.socket.emit('invalid data','#url');
      callback(null);
    } 
  }
  
  var init = function(socket) {
    self.socket = socket;
    socket.emit('hello');
    socket.on('hello',function(url){
      find_tool_for(url,function(obj){
        if(obj != null) {
          require('./tools/'+obj[0]).drill(self.socket, obj[1]);
        }
      });
    });
  }
  
	return { //API
		init: init,
	}
})();
