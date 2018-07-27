{
  let view = {
    el : '#page-3',
    show(){
      $(this.el).show();
    },
    hide(){
      $(this.el).hide();
    }
  }
  let controller = {
    init(view){
      this.view = view;
      this.bindEvents();
      this.bindEventsHub();
    },
    bindEvents(){

    },
    bindEventsHub(){
      window.eventHub.on('selectTab',(tabName) => {
        if(tabName === 'page-3'){
          this.view.show();
        }else{
          this.view.hide();
        }
      })
    }
  }
  controller.init(view);
}