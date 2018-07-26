{
  let view = {
    el : '#loading-container'
  }
  let controller = {
    init(view){
      this.view = view;
      this.bindEvents();
      this.bindEventsHub();
    },
    bindEvents(){

    },
    hide(){
      $(this.view.el).hide();
    },
    show(){
      $(this.view.el).show();
    },
    bindEventsHub(){
      window.eventHub.on('beforeUpload',()=>{
        console.log(111);
        this.show();
      });
      window.eventHub.on('fileUploaded',()=>{
        this.hide();
      })
    }
  }

  controller.init(view);
}