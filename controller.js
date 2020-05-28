const url = require('url');
const http = require('http');
const path = require('path');


module.exports = http.createServer((req, res) => {

    var service = require('./service.js');
    var urlPath = url.parse(req.url, true).pathname;
    var validPaths = ['/login', '/register', '/statistics', '/logout', '/home', '/about', '/admin', '/style']
    var options = {
        host: req.host,
        path: urlPath,
        port: 0
    }; 
    if (validAsset(urlPath)){
        options.path = options.path.substr(0,options.path.length-4);
        options.port = 3001;
        service.RequestAsset(options, res);
    }
    else{
        if ((validPaths.includes(urlPath) && req.method === 'GET')){
            options.port = 3001;
            service.Request(options, res);
        }
        else
        {
    
            res.writeHead(404);
            res.write('');
            res.end();
        }
    }
    
    
        
});

function validAsset(urlpath){
    var assetsTypes = [ '.png', '.ico', '.jpg']
    if (assetsTypes.includes(path.extname(urlpath)))
        return true;
    else
        return false;
}