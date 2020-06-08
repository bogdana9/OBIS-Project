const User = require('./database_models/users.js')
const tokenManager = require('../libs/token-manager/tokenManager.js');
var manager = new tokenManager('lvgUQa6YlAsybgS8fg8J');


function checkUser(res, data){
  var query =  User.find(data);
  query.exec(function(err,resQuery){
  if(err){
    console.log(err);
  }
  if(resQuery.length == 1){
    res.writeHead(200, {'Content-Type':'text/html'});
    header = { alg: 'sha512', type: 'JWT' }
    body = { username: resQuery[0].username, admin: resQuery[0].admin }
    res.write(manager.createSignedToken(header,body));
    res.end();
  }else{
    res.writeHead(404, {'Content-Type':'text/html'});
    res.write("");
    res.end();
  }
});
}


function register(res, data){
  var query =  User.find({"username":data.username});
  query.exec(function(err,resQuery){
  if(err){
    console.log(err);
  }
  if(resQuery.length == 0){
    res.writeHead(200, {'Content-Type':'text/html'});
    const user = new User(data);
    user.save((error) => {
      if (error) {
        console.log(error);
      }
    });
    header = { alg: 'sha512', type: 'JWT' }
    body = { username: data.username, admin: data.admin }
    res.write(manager.createSignedToken(header,body));
    res.end();
  }else{
    res.writeHead(404, {'Content-Type':'text/html'});
    res.write("");
    res.end();
  }
});
}


function cryptPassword(password){
  return manager.cryptMsg(password);
}


function loginRequest(req, res) {
  var validUrl = new URL('https://example.org/'+req.url);
  data = {
          "username": validUrl.searchParams.get('username'),
          "password": cryptPassword(validUrl.searchParams.get('password'))
         }
  checkUser(res,data);
}


function registerRequest(req, res){
  var validUrl = new URL('https://example.org/'+req.url);
  data = {
          "username": validUrl.searchParams.get('username'),
          "password": cryptPassword(validUrl.searchParams.get('password')),
          "email": validUrl.searchParams.get('email'),
          "admin": false
  }
  register(res,data)
}

function registerAdminRequest(req, res){
  var validUrl = new URL('https://example.org/'+req.url);
  data = {
          "username": validUrl.searchParams.get('username'),
          "password": cryptPassword(validUrl.searchParams.get('password')),
          "email": validUrl.searchParams.get('email'),
          "admin": true
  }
  register(res,data)
}


function error(res, errorCode){
    res.writeHead(errorCode, {'Content-Type':'text/html'});
    res.write('');
    res.end();
  }


exports.error = error;
exports.registerRequest = registerRequest;
exports.loginRequest = loginRequest;
exports.registerAdminRequest = registerAdminRequest;
