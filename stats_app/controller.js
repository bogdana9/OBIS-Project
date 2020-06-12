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
    var registerType = extartcRegisterType(req.url);
    var manager = new tokenManager('HOnDzfk8EEJBkqgZwsy8');
    if(manager.checkToken(token) == true){
      if(registerType.startsWith('update') && req.method === 'GET'){
          service.updateStats(res);
      }
      if(registerType.startsWith('stats') && req.method === 'GET'){
        service.csvStats(req, res);
      }
      if(!registerType.startsWith('update') && !registerType.startsWith('stats')){
          service.error(res, 404);
      }

  }
  else{
        service.error(res, 403);
  }

});



function extarctToken(url_sting){
    var path = url.parse(url_sting).pathname.split('/');
    return path[1];
}


function extartcRegisterType(url_sting){
    var path = url.parse(url_sting).pathname.split('/');
    return path[2];
}

module.exports = server;
