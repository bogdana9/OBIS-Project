const url = require('url');
const https = require('https');
const path = require('path');
const fs = require('fs');
const tokenManager = require('../libs/token-manager/tokenManager.js');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};


server = https.createServer(options, function (req, res) {
    var service = require('./service.js');
    var token = extarctToken(req.url);
    var manager = new tokenManager('UQG32dE0n0MI3rWRavag');
    if(manager.checkToken(token) == true){
        service.pageRequest(req, res);
    }
    else{
        res.writeHead(403, {'Content-Type':'text/html'});
        res.write('');
        res.end();
    }
});


function extarctToken(url_sting){
  var path = url.parse(url_sting).pathname.split('/');
  return path[1];
}


module.exports = server;
