{
  let view = {
    el : '#songs-container',
    tplLi:`
      <li>
        <div class="item">
          <div class="info">
              <span class="num">1.</span>
              <span class="name">__name__</span>
            </div>
            <div class="options">
                <i class="iconfont icon-edit"></i>
                <i class="iconfont icon-delete"></i>
            </div>
        </div>					
      </li>
    `,
    tplUl:`<ul>__list__</ul>`,
    render(data){
      let liHtml='';
      data.map((item) => {
        liHtml += this.tplLi.replace('__name__',item['name']);
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
    ]
  };

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render(this.model.data);
      window.eventHub.on('create',(data) => {
        this.model.data.push(data);
        this.view.render(this.model.data);
			})
    },
    active(data){
      console.log(data);
    }
  }
  controller.init(view,model);
}