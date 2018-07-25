// 事件中心
window.eventHub = {
  events(){
    // 初始化，此处存储hash，key 为事件名称，value为数组，数组内的值为回调事件
  },
  emit(eventName,data){   //发布 eventName:为事件名称，data为传入的数据
    // 事件触发
    console.log(JSON.stringify(this));
    let fnList = this.events[eventName];
    fnList.map((fn) => {
      fn.call(undefined,data);
    })
  },
  on(eventName,fn){     //订阅 eventName:为事件名称，fn 为回调函数
    // 事件监听
    if(this.events[eventName] === undefined){
      this.events[eventName] = []
    }
    this.events[eventName].push(fn);
    
  },
  off(){
    
  }
}