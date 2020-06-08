const url = require('url');
const fs = require('fs');
const path = require('path');

const types = {".css":"text/css", ".txt":"text/plain", ".html":"text/html", ".png": "image/png", ".ico": "image/png",  ".jpg": "image/jpg", ".js": "text/javascript"}


function pageRequest(req, res) {
    var filename = extarctFileName(req.url);
    var file_path = searchFile(__dirname, filename);

    if (fs.existsSync(file_path)) {
         fs.readFile(file_path , function(error, data) {
                  if (error) {
                     res.writeHead(404, {'Content-Type':'text/html'});
                     res.write('');
                     res.end();
                  } else {
                        console.log(file_path)
                        res.writeHead(200, {'Content-Type':types[path.extname(file_path)]});
                        res.write(data);
                        res.end();
                     }
         });
   }else{
      res.writeHead(403, {'Content-Type':'text/html'});
      res.write('');
      res.end();
   }
}


function walk(dir) {
    files = fs.readdirSync(dir);
    filelist = [];
    files.forEach(function(file) {
        var fullpath = dir + '/' + file;
        if (fs.statSync(fullpath).isDirectory()) {
            filelist = filelist.concat(walk(fullpath));
        }
        else {
            filelist.push(fullpath);
        }
    });
    return filelist;
}


function searchFile(dir, filename){
    var files = walk(dir);
    for (file of files){
    if (path.basename(file,path.extname(file)) == filename)
            return file;
    }
    return '';
}


function extarctFileName(url_sting){
  var path = url.parse(url_sting).pathname.split('/');
  var filename = path[2];
  return filename
}


function error(res, errorCode){
    res.writeHead(errorCode, {'Content-Type':'text/html'});
    res.write('');
    res.end();
  }


exports.error = error;
exports.pageRequest = pageRequest;
