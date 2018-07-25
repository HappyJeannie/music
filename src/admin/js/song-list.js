{
  let view = {
    el : '#songs-container',
    tplLi:`
      <li>
        <div class="item">
          <div class="info">
              <span class="num"><i class="icon iconfont icon-play1"></i></span>
              <div class="msg">
                <p class="name">__name__</p>
                <p class="name"><i class="icon iconfont icon-my"></i>__singer__</p>
              </div>
              
            </div>
            <div class="options">
                <i class="iconfont icon-edit edit"></i>
                <i class="iconfont icon-delete del"></i>
            </div>
        </div>					
      </li>
    `,
    tplUl:`<ul>__list__</ul>`,
    render(data){
      console.log(data);
      let liHtml='';
      data.map((item) => {
        liHtml += this.tplLi.replace('__name__',item['name']).replace('__singer__',item['singer']);
      })
      $(this.el).html(this.tplUl.replace('__list__',liHtml));
    }
  }

  let model = {
    data:[
      {
        "name":"歌曲1",
        "singer":"歌手1",
        "id":"1",
        "url":"www.baidu.com"
      },
      {
        "name":"歌曲1",
        "singer":"歌手1",
        "id":"1",
        "url":"www.baidu.com"
      },
      {
        "name":"歌曲1",
        "singer":"歌手1",
        "id":"1",
        "url":"www.baidu.com"
      }
    ],
    fetchAll(){
      // 获取所有歌曲
      let query = new AV.Query('Songs');
      let that = this;
     return new Promise((resolve,reject)=>{
      query.find().then(function (songs) {
        let songsList = [];
        for(let i = 0;i<songs.length;i++){
          let song = {};
          let data = songs[i].attributes;
          song.id= songs[i].id;
          for(let key in data){
            song[key] = data[key];
          }
          songsList.push(song)
        }
        that.data = songsList;
        resolve(songsList);
      }).then(function(todos) {
        // 更新成功
      }, function (error) {
        // 异常处理
      });
     }) 
    },
    delSong(songInfo){
      let {id,tableName} = songInfo;
      console.log(id);
      console.log(tableName);
      return new Promise((resolve,reject) => {
        AV.Query.doCloudQuery('delete from '+ tableName +' where objectId="'+ id +'"').then(function (res) {
          // 删除成功
          console(res);
        }, function (error) {
          // 异常处理
        });
        // let song = AV.Object.createWithoutData(tableName, id);
        // song.destroy().then(function (success) {
        //   // 删除成功
        //   resolve(success)
        // }, function (error) {
        //   // 删除失败
        //   reject(error);
        // });
      })
    }
  };

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.bindEvents();
      this.getAllSongs();
      this.bindEventsHub();
    },
    active(data){
      console.log(data);
    },
    bindEvents(){
      // 增加删除事件
      this.delEvent();
    },
    getAllSongs(){
      this.model.fetchAll().then(() => {
        this.view.render(this.model.data);
      });
    },
    bindEventsHub(){
      // 事件订阅，监听是否新增了歌曲
      window.eventHub.on('create',(data) => {
        this.model.data.push(data);
        this.view.render(this.model.data);
			})
    },
    delEvent(){
      let that = this;
      $(this.view.el).on('click','li .del',(e)=>{
        e.stopPropagation();
        //$(target).parents('li').remove();
        console.log('click');
        console.log(e.target);
        let target = e.target;
        
        let idx = $(target).parents('li').index();
        console.log(idx);
        let songInfo = {
          id : this.model.data[idx].id,
          tableName : 'Songs'
        }
        this.model.delSong(songInfo)
          .then((res) => {
            console.log('删除成功');
            this.model.data.splice(idx,1);
            this.view.render(this.model.data);
          })
        
      })
    }
  }
  controller.init(view,model);
}