const url = require('url');
const fs = require('fs');




exports.pageRequest = function (req, res, fileType) {
    const reqUrl = url.parse(req.url);
    var path = __dirname + reqUrl.pathname;
    console.log(req.url);
    if (fs.existsSync(path)) {
      fs.readFile(path , function(error, data) {
               if (error) {
                  res.writeHead(404, {'Content-Type':'text/html'});
                  res.write('');
                  res.end();
               } else {
                  res.writeHead(200, {'Content-Type':fileType});
                  res.write(data);
                  res.end();
               }
      });
   }else{
      res.writeHead(404, {'Content-Type':'text/html'});
      res.write('');
      res.end();
   }
}


exports.invalideType= function (res) {
   
      res.writeHead(404, {'Content-Type':'text/html'});
      res.write('');
      res.end();
}
