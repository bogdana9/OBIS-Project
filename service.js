const url = require('url');
const http = require("http");

exports.Request = function (req, res) {
    if(getExtention(req.path) == 'png' || getExtention(req.path) == 'jpg'){
        req.path = '/images' + req.path
    }else{
        req.path = '/' + getExtention(req.path) + req.path
    }
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

function getExtention(filePath){
    regex = new RegExp('[^.]+$');
    extension = filePath.match(regex);
    return extension;    
}
