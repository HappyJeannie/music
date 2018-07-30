{
  let view = {
    el : '#app',
    tpl : `
      <audio src="__url__"></audio>
      <div class="options">
        <button class="play">播放</button>
        <button class="pause">暂停</button>
      </div>
    `,
    render(data){
      console.log(data);
      $(this.el).append(this.tpl.replace('__url__',data.url));
    },
    play(){
      let audio = $(this.el).find('audio').get(0);
      audio.play();
    },
    pause(){
      let audio = $(this.el).find('audio').get(0);
      audio.pause();
    }
  }
  let model = {
    data:{
      id:'',
      name:'',
      singer:'',
      url:''
    },
    getSongDetail(){
      var query = new AV.Query('Songs');
      return query.get(this.data.id).then(function (song) {
        // 成功获得实例
        console.log(song);
        let data = {
          id : song.id,
          name : song.attributes.name,
          singer : song.attributes.singer,
          url : song.attributes.url
        };
        return data;
      }, function (error) {
        // 异常处理
      });
    }
  }
  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.bindEvents();
      this.model.getSongDetail()
        .then(
          (res) => {
            this.model.data = res;
            this.view.render(this.model.data);
          }
        )
    },
    bindEvents(){
      this.getSongId();
      //点击播放音乐
      $(this.view.el).on('click','.music',()=>{
        if($(this.view.el).find('.music').hasClass('active')){
          this.view.pause();
          $(this.view.el).find('.music').removeClass('active');
        }else{
          this.view.play();
          $(this.view.el).find('.music').addClass('active');
        }
      })
    },
    getSongId(){
      let songId = window.location.href.split('?')[1].split('=')[1];
      this.model.data.id = songId;
    }
  }
  controller.init(view,model);
}