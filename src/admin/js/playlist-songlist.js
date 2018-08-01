{
  let view = {
    el : "#songList",
    liTpl : `
      <li><input type="checkbox" name="song">__name__</li>
    `,
    ulTpl:`<ul>__list__</ul>`,
    render(data){
      let $liHtml = '';
      for(let i = 0;i<data.length;i++){
        $liHtml += this.liTpl.replace('__name__',data[i].name)
      }
      let $html = this.ulTpl.replace('__list__',$liHtml);
      $(this.el).html($html);
    }
  }

  let model = {
    data:{},
    fetchAll(){
      // 获取所有歌曲
      let query = new AV.Query('Songs');
      return query.find().then(function (songs) {
        let songsList = [];
        for(let i = 0;i<songs.length;i++){
          let song = {};
          let data = songs[i].attributes;
          song.id= songs[i].id;
          song.selected = false;
          for(let key in data){
            song[key] = data[key];
          }
          songsList.push(song)
        }
        return songsList;
      })
    }
  }

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.model.fetchAll()
        .then((songList)=>{
          console.log('获取歌曲')
          console.log(songList)
          this.model.data = songList;
          console.log(this.model.data);
          this.view.render(this.model.data);
        });
      
      this.bindEvents();
    },
    bindEvents(){
      // 给每个歌曲的点击添加事件
      this.selectSong();
    },
    selectSong(){
      $(this.view.el).on('click','input',(e)=>{
        let idx = $(e.currentTarget).parent('li').index();
        this.model.data[idx].selected = $(e.currentTarget).prop('checked');
        let data = this.model.data.filter((item)=>{
          return item.selected
        })
        //console.log(data);
        window.eventHub.emit('select',data);
      })
    }
  }

  controller.init(view,model);
}