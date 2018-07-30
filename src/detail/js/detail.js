{
  let view = {
    el : '#app',
    tpl : `
      <audio src="__url__"></audio>
    `,
    render(data){
      $(this.el).append(this.tpl.replace('__url__',data.url));
      //$(this.el).find('audio').get(0).playbackRate = 3.0;
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
      url:'',
      cover:'',
      lyrics:''
    },
    getSongDetail(){
      var query = new AV.Query('Songs');
      return query.get(this.data.id).then(function (song) {
        // 成功获得实例
        console.log(song);
        let data = {
          id : song.id,
          ...song.attributes
        };
        console.log(data);
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
            // 监听音乐播放完毕
            this.songEnded();
            // 添加cover
            this.addCover();
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
    },
    songEnded(){
      $(this.view.el).find('audio').get(0).onended = () => {
        this.view.pause();
        $(this.view.el).find('.music').removeClass('active');
      }
    },
    addCover(){
      $(this.view.el).find('.cover').css({
        'background-image':`url(${this.model.data.cover})`
      })
      $(this.view.el).find('.song').css({
        'background-image':`url(${this.model.data.cover})`
      })
    }
  }
  controller.init(view,model);
}