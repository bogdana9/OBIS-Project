const url = require('url');
const http = require("http");
const fs = require("fs");
var tokens = {
    3001 : 'eyJhbGciOiJzaGE1MTIiLCJ0eXBlIjoiSldUIn0.eyJwb3J0IjozMDAwLCJuYW1lIjoiZ2F0ZWtlZXBlciJ9.c5YxHn2RJ7zHosC9D6fPr-ohdZ72mrRxYiaIjHsDrb59vpsNTKB7rcgTLCu52sF9Og_qntbkv_1oiIAcz09LPQ'
}

exports.Request = function (req, res) {
    req.path = '/' + tokens[req.port] + req.path;
    callback = function(response) {
        var str = '';  
        
            response.on('data', function (chunk) {
                str += chunk;
                
            });   
        
        response.on('end', function () {
            res.writeHead(response.statusCode, {'Content-Type':response.headers['content-type']});
            res.write(str);
            res.end(); 
          });
      }
      
      http.request(req, callback).end();
    
}


exports.RequestAsset = function (req, res){
    req.path = '/' + tokens[req.port] + req.path;
    callback = function(response) {
        var str = '';        
    
        response.on('data', function (chunk) {
            str += chunk;
        });
    
        response.on('end', function () {
            fs.readFile(str , function(error, data) {
                if (error) {
                   res.writeHead(404, {'Content-Type':'text/html'});
                   res.write('');
                   res.end();
                } else {
                   res.writeHead(200, {'Content-Type':response.headers['content-type']});
                      res.write(data);
                      res.end();
                   }          
       });
        });
      }
      
     http.request(req, callback).end();
}



  