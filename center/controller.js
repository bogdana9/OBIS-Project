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
  var validations = [validAuthentification, validLocation, validSecureContent]
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
      path: urlPath + 'locked',
      method: 'GET',
      rejectUnauthorized: false,
      requestCert: true,
      agent: false
    };
    var validPaths = ['/statistics', '/admin']
    validPaths = validPaths.map(x => urlPath.startsWith(x))

    if ((validPaths.includes(true) == true) && service.checkToken(req) && req.method === 'POST'){
        service.request(options, res);
        return true;
    }
    return false;
}


function validAuthentification(res, req, urlPath, service){
  return false;
}


module.exports = server;
