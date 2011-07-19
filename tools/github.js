//GitHub API
var GitHubApi = require("github").GitHubApi;
var github = new GitHubApi(true);

module.exports = (function(){
  var needs = ['email', 'phone'];
  var descriptions = {
    email: 'your email',
    phone: 'your phone number'
  }
  var info = {};
  
  var req_data = function(need) {
    console.log(need);
    needs = needs.slice(1);
    socket.emit('data_request',{id: need, description: descriptions[need]});
    socket.on('data_response',function(obj) {
      if(info[need] != null) {
        console.log('updating ' + need + ' as ' + obj);
      } else {
        info[need] = obj;
        if(needs.length != 0) {
          req_data(needs[0]);
        } else {
          socket.emit('done');
          return;
        }
      }
      
    });
  }
  
  var drill = function(socket, path) {
    console.log('drilling...');
    // extract what we can initially
    
    // construct actual needs
    
    // request the data we can't get ourselves
    req_data(needs[0]);
  }
  
  return { //exposed API
    drill: drill
  }
})();









// function() {
//   //init the API's
//  var userapi = github.getUserApi(),
//  repoapi = github.getRepoApi();
// 
//  //extract the email if possible
//  userapi.show(u_p[0], function(err,user){
//    if(err) console.log(err);
//    else {
//      console.log('user:\n' + user);
//      if(user.email) {
//        console.log('√ got email');
//        this.now.project.email = user.email;
//      }
//    }
//  });
// 
//  //extract todo's from suspected places
//    //first we go through the obvious place of Issues
//  var issueApi = github.getIssueApi();
//  issueApi.getList(u_p[0], u_p[1], "open", function(err,issues) {
//    if(err) {
//      console.log(err); return;
//    }
//    console.log('issues:\n' + issues);
//    issues.forEach(function(o){
//      this.now.project.issues.push(o);
//    });
//  });
// }