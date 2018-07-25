
{
  let view = {
    el : '#songs-container',
    tpl:`
      <ul>
        <li>
          <div class="item">
            <div class="info">
                <span class="num">1.</span>
                <span class="name">歌曲名称</span>
              </div>
              <div class="options">
                  <i class="iconfont icon-edit"></i>
                  <i class="iconfont icon-delete"></i>
              </div>
          </div>					
        </li>
        <li class="active">
          <div class="item">
            <div class="info">
                <span class="num">1.</span>
                <span class="name">歌曲名称</span>
              </div>
              <div class="options">
                  <i class="iconfont icon-edit"></i>
                  <i class="iconfont icon-delete"></i>
              </div>
          </div>					
        </li>
        <li>
          <div class="item">
            <div class="info">
                <span class="num">1.</span>
                <span class="name">歌曲名称</span>
              </div>
              <div class="options">
                  <i class="iconfont icon-edit"></i>
                  <i class="iconfont icon-delete"></i>
              </div>
          </div>					
        </li>
      </ul>
    `,
    render(data){
      $(this.el).html(this.tpl);
    }
  }

  let model = {};

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render(this.model.data);
    },
    active(data){
      console.log(data);
    }
  }
  controller.init(view,model);
}