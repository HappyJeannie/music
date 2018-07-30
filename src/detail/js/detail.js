{
  let view = {
    el : '',
    render(data){

    }
  }
  let model = {
    data:null,
    songId : undefined,
    getSongDetail(){
      var query = new AV.Query('Songs');
      query.get(this.songId).then(function (song) {
        // 成功获得实例
        console.log('详情获取成功')
        console.log(song)
      }, function (error) {
        // 异常处理
      });
    }
  }
  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render(this.model.data);
      this.bindEvents();
      this.model.getSongDetail();
    },
    bindEvents(){
      this.getSongId();
    },
    getSongId(){
      let songId = window.location.href.split('?')[1].split('=')[1];
      this.model.songId = songId;
    }
  }
  controller.init(view,model);
}