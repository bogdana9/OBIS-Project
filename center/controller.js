const url = require('url');
const https = require('https');
const path = require('path');
const fs = require('fs');
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};


server = https.createServer(options, function (req, res) {
  var service = require('./service.js');
  var urlPath = req.url;
  var validations = [validAuthentification, validLocation, validSecureContent, validAdminContent]
  var reqSolved = false;

  for (i = 0; i < validations.length; i++){
      if (validations[i](res, req, urlPath, service) == true){
              reqSolved = true;
      }
  }
  if(reqSolved == false){
    service.error(res, 404);
  }
});


function validLocation(res, req, urlPath, service){
    var options = {
        host: req.host,
        port: 3001,
        path: urlPath,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    };
    var validPaths = ['/login', '/register', '/statistics', '/logout', '/home', '/about', '/admin', '/style', '/client', '/authClient']
    validPaths = validPaths.map(x => urlPath.startsWith(x))

    if ((validPaths.includes(true) == true) && req.method === 'GET'){
        service.request(options, res);
        return true;
    }
    return false;
}


function validSecureContent(res, req, urlPath, service){
    var options = {
      host: req.host,
      port: 3001,
      path: '/' + url.parse(urlPath).pathname.split('/')[1] + 'locked',
      method: 'POST',
      rejectUnauthorized: false,
      requestCert: true,
      agent: false
    };
    var validPaths = ['/statistics']
    validPaths = validPaths.map(x => urlPath.startsWith(x))
    if ((validPaths.includes(true) == true) && service.checkToken(req) && req.method === 'POST'){
        service.request(options, res);
        return true;
    }
    return false;
}


function validAdminContent(res, req, urlPath, service){
    var options = {
      host: req.host,
      port: 3001,
      path: '/' + url.parse(urlPath).pathname.split('/')[1] + 'locked',
      method: 'POST',
      rejectUnauthorized: false,
      requestCert: true,
      agent: false
    };
    var apisPorts = {
      "webpage_serving_app": 3001,
      "auth_app": 3002
    }
    var validPaths = ['/admin', '/adminRegister']
    validPaths = validPaths.map(x => urlPath.startsWith(x))
    var validUrl = new URL('https://example.org/'+req.url);
    var api = validUrl.searchParams.get('api');
    if ((validPaths.includes(true) == true) && service.checkAdminToken(req) && req.method === 'POST'){
      var state = validUrl.searchParams.get('state');
      var username = validUrl.searchParams.get('username');
      if(username != null){
        options.port = 3002;
        options.path = urlPath;
      }
      if (state == "off"){
        service.endAPI(apisPorts[api]);
        return true;
      }
      if (state == "on"){
        service.startAPI(api);
        return true;
      }
      service.request(options, res);
      return true;
    }
    return false;
}


function validAuthentification(res, req, urlPath, service){
  var options = {
    host: req.host,
    port: 3002,
    path: urlPath,
    method: 'POST',
    rejectUnauthorized: false,
    requestCert: true,
    agent: false
  };
  var validPaths = ['/login', '/register']
     validPaths = validPaths.map(x => urlPath.startsWith(x))
     if ((validPaths.includes(true) == true ) && req.method === 'POST'){
         service.request(options, res);
         return true;
     }
     return false;
}


module.exports = server;
