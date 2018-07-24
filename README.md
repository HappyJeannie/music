# 仿网易云音乐

### 一、项目架构

### 1、用例图
![普通用户用例图](https://github.com/HappyJeannie/Demo/blob/master/imgs/music/普通用户用例图.png)

![管理员用例图](https://github.com/HappyJeannie/Demo/blob/master/imgs/music/管理员用例图.png)

用例图是用来做*需求分析*时使用的图示，

### 2、线框图
用例图绘制完成后就是绘制线框图，也就是我们常说的原型。在这我就不进行绘制了。

### 3、系统架构图
![系统架构图](https://github.com/HappyJeannie/Demo/blob/master/imgs/music/3、系统架构图.png)

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

leancloud 能够给我们提供一个数据库，里面保存的都是字符串，但是如果我们希望存储文件的话，leancloud 是不可实现的。这里采用七牛云的存储服务。

在使用七牛云的过程中，需要根据用户的 AccessKey 、 SecretKey 进行基础配置，并且需要在服务端运行，此处我们以 Node.js 作为服务端进行七牛云的 SDk 安装和配置。

##### 1) 开通七牛云服务

[开通地址](https://www.qiniu.com)
需要实名认证。

##### 2) [创建 bucket ](https://help.aliyun.com/document_detail/53045.html?spm=a2c4g.11186623.2.5.2FZzaq)

进入控制台后，在侧边栏选择对象存储，进入页面后新建存储空间，访问控制设置为公开空间，存储区域自选，命名为 163-music 。确定创建后，在右上角个人面板中进入密钥管理，能够查询到当前使用的 AccessKey 、SecretKey 。
在项目根目录创建 qiniu-config.json 文件，并将  AccessKey 、SecretKey 、bucket 值以 json 对象的方式存储到文件中，使用时直接读取文件信息。注意，此文件不要上传至 github 中，以免造成不必要的损失。在 `.gitignore` 中添加忽略文件。

##### 3) 安装 SDK

在当前项目的根目录的终端中输入以下指令：
```
npm install --save plupload@^2.3.2 qiniu-js@^1.0.22
```

##### 4) 本地启动服务

由于上传图片需要通过服务端获取 uptoken ，所以在本地启动一个 node 服务。在项目根目录创建文件 server.js ，代码请看文件。

##### 5) 在页面中实现上传功能

在 `./src/admin.html` 中引入 `qiniu.min.js` 、`plupload.min.js`，上传代码如下：
```
var uploader = Qiniu.uploader({
  runtimes: 'html5',    //上传模式,依次退化
  browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
  uptoken_url: 'http://localhost:8888/uptoken',            //本地启动 node 服务，端口 8888 ，路径 `/uptoken`
  //uptoken : '', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
  //unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
  // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
  domain: 'http://qiniu-plupload.qiniudn.com/',   //bucket 域名，下载资源时用到，**必需**
  get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
  container: 'container',           //上传区域DOM ID，默认是browser_button的父元素，
  max_file_size: '5mb',           //最大文件体积限制
  max_retries: 3,                   //上传失败最大重试次数
  dragdrop: true,                   //开启可拖曳上传
  drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
  chunk_size: '4mb',                //分块上传时，每片的体积
  auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
  init: {
      'FilesAdded': function(up, files) {
          plupload.each(files, function(file) {
              // 文件添加进队列后,处理相关的事情
          });
      },
      'BeforeUpload': function(up, file) {
              // 每个文件上传前,处理相关的事情
      },
      'UploadProgress': function(up, file) {
              // 每个文件上传时,处理相关的事情
      },
      'FileUploaded': function(up, file, info) {
              // 每个文件上传成功后,处理相关的事情
      },
      'Error': function(up, err, errTip) {
              //上传出错时,处理相关的事情
      },
      'UploadComplete': function() {
              //队列文件处理完毕后,处理相关的事情
      }//,
      //'Key': function(up, file) {
          // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
          // 该配置必须要在 unique_names: false , save_key: false 时才生效
          //var key = "";
          // do something with key here
          //return key
      //}
  }
});
```
注意以上代码需要在 server.js 文件启动的情况下运行。

### 三、页面创建

#### 1、管理员页面创建

在 URL / URI 中是不能包含汉字或者特殊字符，如果出现这种情况，那么会将汉字或者特殊字符转换成 URL Eacape Code 编码的字符串，如 `你` 则会被转换成 `%E4%BD%A0`


这个里面的音乐只有管理员有增删改查的权限。