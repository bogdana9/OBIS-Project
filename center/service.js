const url = require('url');
const https = require("https");
const fs = require("fs");
const exec = require('child_process').exec;
const tokenManager = require('../libs/token-manager/tokenManager.js');

var tokens = {
    3001 : 'eyJhbGciOiJzaGE1MTIiLCJ0eXBlIjoiSldUIn0.eyJwb3J0IjozMDAwLCJuYW1lIjoiZ2F0ZWtlZXBlciJ9.c5YxHn2RJ7zHosC9D6fPr-ohdZ72mrRxYiaIjHsDrb59vpsNTKB7rcgTLCu52sF9Og_qntbkv_1oiIAcz09LPQ',
    3002:  'eyJhbGciOiJzaGE1MTIiLCJ0eXBlIjoiSldUIn0.eyJwb3J0IjozMDAwLCJuYW1lIjoiZ2F0ZWtlZXBlciJ9.HGLdTLmmq4_YLdElDyHzZeqxCzEbvirJBxXYgaZdiMTZ8mj-Ng4_lj1RsFtJV9LmHkelbeXp0wuDCK_b0_1gWQ'
}
var apisPorts = {
    "webpage_serving_app": 3001,
    "auth_app": 3002
}

var apis = {
    3001 : true,
    3002:  true
}

function request(req, res) {
    req.path = `/${tokens[req.port]}${req.path}`;
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
      if(apis[req.port]){
          https.request(req, callback).end();
      }
      else {
          error(res,404);
      }
}


function startAPI(apiName){
    exec(`node ../${apiName}/server.js`, function(error, stdout, stderr){
        console.log(stdout);
    });
    apis[apisPorts[apiName]] = true;
}

function endAPI(port){
  exec (`netstat -ano | find "LISTENING" | find "${port}"`, function(error, stdout, stderr){
          pid = stdout.split("LISTENING      ")[1].split("\r")[0];
          exec (`taskkill /f /pid ${pid}`, function(error, stdout, stderr){
            console.log(stdout);
          });
  });
  apis[port] = false;
}

function startAllAPI(){
    apisNames = ['webpage_serving_app', 'auth_app']
    for (i = 0; i < apisNames.length; i++){
      startAPI(apisNames[i]);
    }
}


function checkToken(req){
  var validUrl = new URL('https://example.org/'+req.url);
  var token = validUrl.searchParams.get('token');
  var manager = new tokenManager('lvgUQa6YlAsybgS8fg8J');
  return manager.checkToken(token);
}


function checkAdminToken(req){
  var validUrl = new URL('https://example.org/'+req.url);
  var token = ""
  token = validUrl.searchParams.get('token');
  var manager = new tokenManager('lvgUQa6YlAsybgS8fg8J');
  if (manager.checkToken(token)){
    var user = manager.decodeJson(token.split(".")[1]);
    return user.admin;
  }
  return false;
}


function error(res, errorCode){
    res.writeHead(errorCode, {'Content-Type':'text/html'});
    res.write('');
    res.end();
  }


exports.error = error;
exports.request = request;
exports.endAPI = endAPI;
exports.startAllAPI = startAllAPI;
exports.startAPI = startAPI;
exports.checkToken = checkToken;
exports.checkAdminToken = checkAdminToken;
