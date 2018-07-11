# 仿网易云音乐

### 一、项目架构

### 1、用例图
![网易云音乐普通用户用例图](http://i2.bvimg.com/651731/fd54c8601cf3075d.jpg)

![网易云音乐管理员用例图](http://i4.bvimg.com/651731/b16d5f03286cc449.jpg)

用例图是用来做*需求分析*时使用的图示，

### 2、线框图
用例图绘制完成后就是绘制线框图，也就是我们常说的原型。在这我就不进行绘制了。

### 3、系统架构图
![网易云音乐系统架构图](http://i2.bvimg.com/651731/93ebc8d4f783e15c.jpg)

### 二、环境搭建

#### 1、LeanCloud 环境搭建

##### 1) 建表
数据库中需要三个表：歌曲列表、歌单表、用户列表，并且歌曲、歌单表只对管理员有写入权限，对于普通用户只有浏览权限。
* User 管理员用户
* Songs 所有歌曲
* Playlist 所有歌单

##### 2) 工具安装

在项目目录中打开终端，并输入 `npm init` 初始化项目，并增加一些目录结构如下：
```
|-- dist                // 打包文件夹
|-- src                 // 源文件文件夹
  |-- index.html        // 首页
  |-- inde.js           // 首页的 js
  |-- admin.html        // 用户管理页面
|-- package.json        // 配置文件
|-- .gitignore          // 忽略哪些文件
```

接下来安装 leancloud ，在终端输入 `npm install leancloud-stroage --save`

##### 3) 初始化代码

[找到 APP_ID 、APP_KEY](https://leancloud.cn/dashboard/app.html?appid=YPvb9cfXnyvVeG54DHsOIscm-gzGzoHsz#/key)
在 index.html 中引入 `./../node_modules/leancloud-storage/dist/av-min.js` 文件，紧接着写入 js ：
```
var APP_ID = 'xxxxxxxx';        
var APP_KEY = 'xxxxxxxx';

AV.init({                               // 初始化
  appId: APP_ID,
  appKey: APP_KEY
});

var TestObject = AV.Object.extend('TestObject');        // 创建数据库
var testObject = new TestObject();                      // 创建一个表
testObject.save({                                       // 保存记录
  words: 'Hello World!'
}).then(function(object) {
  alert('LeanCloud Rocks!');
},
()=>{
  alert('err')
})
```
在项目根目录起动 `http-server -c-1` ，然后在浏览器打开。弹出 `LeanCloud Rocks!` 则表示创建成功。在 Leancloud 中的 `163-mucis` 查看，可以看到新增了一个 TestObject 表并且有一条数据。 OK ，至此， leancloud 初始化完成。

#### 2、OSS 环境搭建

leancloud 能够给我们提供一个数据库，里面保存的都是字符串，但是如果我们希望存储文件的话，leancloud 是不可实现的。可使用七牛云或者阿里云的 OSS 存储。七牛云和阿里云都需要实名认证，由于我个人在阿里云已经实名认证过并且配合 PHPer 使用过 OSS ，所有就直接用 OSS 了。

在使用 OSS 服务的过程中，需要根据用户的 AccessKeyId 、AccessKeySecret 进行基础配置，并且需要在服务端运行，此处我们以 Node.js 作为服务端进行 OSS 的 SDk 安装和配置。

##### 1) 开通阿里云 OSS 服务

[开通地址](https://www.aliyun.com/product/oss?spm=a2c4g.11186623.2.4.2FZzaq)，我使用的

##### 2) [创建 AccessKey ](https://help.aliyun.com/document_detail/53045.html?spm=a2c4g.11186623.2.5.2FZzaq)

创建完成后，最好直接下载 AccessKey 文件到当前项目的根目录，修改文件名为 `oss-data.csv`。注意，此文件不要上传至 github 中，以免造成不必要的损失。在 `.gitignore` 中添加忽略文件。

##### 3) 安装 SDK

在当前项目的根目录的终端中输入以下指令：
```
npm install ali-oss co
```

##### 4) 初始化 Client

在项目的根目录下创建文件 `server.js` ，代码如下：
```
var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.env.PORT || 8888;
var co = require('co');
var OSS = require('ali-oss');

var server = http.createServer((req,res)=>{
  let temp = url.parse(req.url,true);
  let path = temp.pathname;
  let query = temp.query;
  let method = req.method;

  if(path === '/oss/upload'){
    let data = fs.readFileSync('./oss-data.csv','utf-8');             // 读取 AccessKey 数据文件
    let formatData = data.split('\n').join(',').slice(0,-1).split('"').join('').split(',');       // 处理数据
    let akId = formatData[2];
    let akSt = formatData[3];
    
    var client = new OSS({
      region: 'oss-cn-beijing',
      accessKeyId:akId,
      accessKeySecret: akSt
    });
    res.statusCode = 200;
    let str = '';
    co(function* () {
      str = yield client.listBuckets();
      console.log(str);
    }).catch(function (err) {
      console.log(err);
    });

    
    res.setHeader('Content-Type','text/html;charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.write(str);
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
```
在终端启动这个服务，输入 `node server.js` ，然后在浏览器中打开 `http://localhost:8888/oss` ， 在控制台可以看到返回的信息。查看[文档](https://help.aliyun.com/document_detail/32070.html?spm=a2c4g.11186623.6.782.O9G9E8)了解上传、查询、删除等功能的实现。
