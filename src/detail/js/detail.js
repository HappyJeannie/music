{
  let view = {
    el : '#app',
    tpl : `
      <audio src="__url__"></audio>
    `,
    render(data){
      $(this.el).append(this.tpl.replace('__url__',data.url));
      //$(this.el).find('audio').get(0).playbackRate = 3.0;
      let arr = data.lyrics.split('\n');
      for(let i = 0;i<arr.length;i++){
        let reg = /\[([\d:.]+)\](.+)/;
        let a = arr[i].match(reg);
        let time = parseInt(a[1].substr(0,2)) * 60 * 1000 + parseInt(a[1].substr(3,2)) * 1000 + parseInt(a[1].substr(6,2)) + 4000;
        $(this.el).find('.lyrics').append(`<p class='${i===0? "active" : ""}' data-time='${time}'>${a[2]}</p>`)
      }
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
            // 监听音乐播放的过程中的时间
            this.songPlaying();
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
    },
    songPlaying(){
      $(this.view.el).find('audio').get(0).ontimeupdate = (e)=>{
        let currentTime = parseInt(e.timeStamp);
        console.log(currentTime / 1000)
        let allP = $(this.view.el).find('.lyrics>p');
        let idx = 0;
        let minTime = Math.abs(currentTime - parseInt($(allP[0]).attr('data-time')));
        for(let i = 1;i<allP.length;i++){
          if(Math.abs(parseInt($(allP[i]).attr('data-time')) - currentTime) < minTime){
            minTime = Math.abs(parseInt($(allP[i]).attr('data-time')) - currentTime);
            idx = i;
          }
        }
        $(allP[idx]).addClass('active').siblings().removeClass('active');
        let pTop = $(allP[idx]).offset().top;
        let lyricsTop = $(this.view.el).find('.lyrics').offset().top;
        let target = $(this.view.el).find('.lyrics');
        let scroll = parseInt(target.attr('data-top'))+pTop-lyricsTop - 26;
        target.attr('data-top',scroll).scrollTop(scroll)
        //target.attr('data-top',scroll).animate({scrollTop: scroll+'px'}, 300);
      }
    }
  }
  controller.init(view,model);
}