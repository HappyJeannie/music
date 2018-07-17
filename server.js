var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.env.PORT || 8888;
var querystring = require('querystring');
const qiniu = require('qiniu');

var server = http.createServer((req,res)=>{
  let temp = url.parse(req.url,true);
  let path = temp.pathname;
  let query = temp.query;
  let method = req.method;
  if(path === '/uptoken'){
    let config = fs.readFileSync('./qiniu-config.json','utf-8');
    let formatData = JSON.parse(config);
    res.statusCode = 200;
    var accessKey = formatData.AccessKey;
    var secretKey = formatData.SecretKey;
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    var options = {
      scope: formatData.bucket,
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);
    
    res.setHeader('Content-Type','text/json;charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.write(`
      {
        "uptoken":"${uploadToken}"
      }
    `);
    res.end();
  }
})
server.listen(port);
console.log(
  "监听 " +
    port +
    " 成功\n打开 http://localhost:" +
    port
);