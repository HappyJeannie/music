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

#### 2、七牛环境搭建