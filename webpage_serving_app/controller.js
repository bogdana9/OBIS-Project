const http = require('http');
const url = require('url');

module.exports = http.createServer((req, res) => {

    var service = require('./service.js');
    var path = url.parse(req.url).pathname;
    const types = {"css":"text/css", "html":"text/html", "png": "image/png"}
    var extension = getExtention(path);
    
    if (extension in types){
        service.pageRequest(req, res, types[extension]);
    }
    else{
        service.invalideType(res);
    }
        
    
    
});


function getExtention(filePath){
    regex = new RegExp('[^.]+$');
    extension = filePath.match(regex);
    return extension;    
}