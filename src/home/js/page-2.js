{
  let view = {
    el : '#page-2',
    liTpl: `
      <li>
        <div class="msg">
          <p>__name__</p>
          <p>
            <i class="hot"></i>__singer__</p>
        </div>
        <div class="play">
          <a href="./../detail/index.html?id=__id__"><i class="icon iconfont icon-play1"></i></a>
        </div>
      </li>
    `,
    ulTpl : `<ul>__list__</ul>`,
    render(data){
      let $html = '';
      console.log(data);
      for(let i = 0;i<data.length;i++){
        let $li = this.liTpl;
        for(var key in data[i]){
          $li = $li.replace(`__${key}__`,data[i][key]);
        }
        console.log($li)
        $html += $li;
      }
      let html = this.ulTpl.replace('__list__',$html);
      $(this.el).find('#hot').html(html);
    },
    show(){
      $(this.el).show();
    },
    hide(){
      $(this.el).hide();
    }
  }
  let model = {
    data :{

    },
    fetchAll(){
      // 获取所有歌曲
      let query = new AV.Query('Songs');
      return query.find().then(
        (res) => {
          let data = [];
          for(let i = 0 ;i<res.length;i++){
            let song = {
              id : res[i].id,
              ...res[i].attributes
            }
            data.push(song);
          }
          return data;
        }
      )
    }
  }
  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.bindEvents();
      this.bindEventsHub();
      this.model.fetchAll()
        .then(
          (res) => {
            console.log('请求成功')
            console.log(res);
            this.model.data = res;
            console.log(this);
            this.view.render(this.model.data);
            console.log(2);
          }
        )
    },
    bindEvents(){

    },
    bindEventsHub(){
      window.eventHub.on('selectTab',(tabName) => {
        if(tabName === 'page-2'){
          this.view.show();
        }else{
          this.view.hide();
        }
      })
    }
  }
  controller.init(view,model);
}