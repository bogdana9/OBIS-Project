const http = require('http');
const url = require('url');
const fs = require('fs');
const tokenManager = require('../tokenManager.js');


module.exports = http.createServer((req, res) => {

    var service = require('./service.js');
    var token = extarctToken(req.url);  
    var a = new tokenManager('UQG32dE0n0MI3rWRavag');

    if(a.checkToken(token) == true){
       service.pageRequest(req, res);
    }
    else{
        res.writeHead(403, {'Content-Type':'text/html'});
        res.write('');
        res.end();
    }
       
    
    
});


function extarctToken(url_sting){
    var path = url.parse(url_sting).pathname;
    var endToken = path.lastIndexOf('/') - 1;
    var token = path.substr(1, endToken);
    return token
}