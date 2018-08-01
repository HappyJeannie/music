{
  let view = {
    el: '#playlist',
    liTpl: `
      <li>
        <a href="javascript:;">
          <div class="img">
            <img src="__cover__">
            <span class="num">
              <i class="icon iconfont icon-erji"></i> __amount__万</span>
          </div>
          <p class="">__name__</p>
        </a>
      </li>
    `,
    ulTpl : `<ul>__list__</ul>`,
    render(data){
      let $html = '';
      console.log(data);
      for(let j = 0;j<6;j++){
        for(let i = 0;i<data.length;i++){
          let $li = this.liTpl;
          for(var key in data[i]){
            $li = $li.replace(`__${key}__`,data[i][key]);
          }
          console.log($li)
          $html += $li;
        }
      }
      
      let html = this.ulTpl.replace('__list__',$html);
      $(this.el).html(html);
    }
  }
  let model = {
    data : null,
    fetchAll : function(){
      // 获取所有歌曲
      let query = new AV.Query('playList');
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
    init(view, model) {
      this.view = view;
      this.model = model;
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
    }
  }
  controller.init(view, model);
}