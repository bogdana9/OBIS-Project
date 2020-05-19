const url = require('url');
const http = require('http')
module.exports = http.createServer((req, res) => {

    var service = require('./service.js');
    var path = url.parse(req.url).pathname;
    
    console.log(path);
    if (path.includes('/page') == true  && req.method === 'GET'){
        path = path.split('/page')[1];
        var options = {
            host: req.host,
            path: path,
            port: 3001
        };    
        service.Request(options, res);
    }else{
        res.writeHead(404);
                  res.write('');
                  res.end();
    }
    
        
});