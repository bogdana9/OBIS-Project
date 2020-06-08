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
    var manager = new tokenManager('lvgUQa6YlAsybgS8fg8J');
    if(manager.checkToken(token) == true){
        if(registerType.startsWith('login')){
            service.loginRequest(req, res);
        }
        if(registerType.startsWith('register')){
            service.registerRequest(req, res);
        }
        if(registerType.startsWith('adminRegister')){
            service.registerAdminRequest(req, res);
        }
        if(registerType.startsWith('adminRegister') == false && registerType.startsWith('register') == false && registerType.startsWith('login') == false){
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
