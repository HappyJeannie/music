{
  let view = {
    el : '#tabs'
  }
  let controller = {
    init(view){
      this.view = view;
      this.bindEvents();
      this.bindEventsHub();
    },
    bindEvents(){
      $(this.view.el).on('click','li',(e)=>{
        let $li = $(e.currentTarget);
        $li.addClass('selected').siblings().removeClass('selected');
        let tabName = $li.attr('data-tabname');
        console.log(tabName)
        // $('.tab-item').css('display','none');
        // $(`#${tabName}`).show();
        // 出发点击事件
        window.eventHub.emit('selectTab',tabName);
      })
    },
    bindEventsHub(){

    }
  }
  controller.init(view);
}