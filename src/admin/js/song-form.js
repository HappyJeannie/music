{
  let view = {
		el : '.editbox',
		init(){
			this.$el = $(this.el)
		},
    tpl : `
      <div class="box">
				<h4 class="title"><i class="iconfont icon-settings"></i> Edit Song</h4>
				<form action="">
					<div class="form-group">
						<label for="">
							<span class="form-title">歌曲名称：</span>
							<input type="text" placeholder="歌曲名称" name="name" value="__name__">
						</label>
					</div>
					<div class="form-group">
						<label for="">
							<span class="form-title">歌手：</span>
							<input type="text" placeholder="歌手" name="singer" value="__singer__">
						</label>
					</div>
					<div class="form-group upload">
						<label for="">
							<span class="form-title">上传文件：</span>
							<div id="container">
								<button type="button" id="pickfiles"><i class="iconfont icon-cloudtouploadyunshangchuan"></i></button>
								<p class="tips">点击或拖拽文件，大小不超过 5 M</p>
							</div>
							<input type="hidden" name="songurl">
						</label>
					</div>
					<div class="form-group fileurl">
							<label for="">
								<span class="form-title">资源路径：</span>
								<input type="text" placeholder="资源路径" readonly value="__url__" name="url">
							</label>
						</div>
					<div class="form-group submit">
						<button type="submit" class="save">保存</button>
						<button type="button" class="cancel">取消</button>
					</div>
				</form>
			</div>
    `,
    render(data = {}){
			let placeholders = ['name','url','singer','id'];
			let html = this.tpl;
			placeholders.map((str) => {
				html = html.replace(`__${str}__`,data[str] || '');
			})
      $(this.el).html(html);
		},
		reset(){
			this.render({});
		}
  }
  let model = {
		data:{
			name : '',			// 歌曲名称
			url : '',				// 歌曲地址
			singer : '',		// 歌手
			id : ''					// 数据库中的id
		},
		createSong(data){
			// 声明类型
			let Song = AV.Object.extend('Songs');
			// 新建对象
			let song = new Song();
			for(var item in data){
				song.set(item,data[item]);
			}
			let that = this;
			return new Promise((resolve,reject) =>{
				song.save().then(function (song) {
					let id = song.id;
					console.log(that.data);
					Object.assign(that.data,{
						id,
						...song.attributes
					})
					console.log(that.data);
					resolve(that.data);
					
					//that.view.render({})
				}, function (error) {
					console.error(error);
					reject(error);
				});
			})
		}
  }
  let controller = {
    init(view,model){
			this.view = view;
			this.view.init();
      this.model = model;
			this.view.render(this.model.data);
			this.bindEvents();
			window.eventHub.on('upload',(data) => {
				console.log('song from 模块得到了 data')
				console.log(data);
				this.view.render(data);
			})
		},
		bindEvents(){
			this.view.$el.on('submit','form',(e)=>{
				alert('表单提交了')
				e.preventDefault();
				let names = ['name','singer','url'];
				if(!this.checkForm(names)){
					return false;
				}
				let hash = {};
				names.map((item) => {
					hash[item] = this.view.$el.find(`[name="${item}"]`).val();
				})
				console.log(hash);
				this.model.createSong(hash)
					.then((res) => {
						console.log('添加完了之后的操作')
						console.log(res);
						this.view.reset();
						window.eventHub.emit('create',res)
						$('input[type="hidden"]').val('');
					});
				
			})
		},
		checkForm(names){
			let canSubmit = true;
			for(let i = 0;i<names.length;i++){
				if(this.view.$el.find('[name="'+names[i]+'"]').val().length === 0){
					canSubmit = false;
				}
			}
			if(!canSubmit)alert('表单信息为必填');
			
			return canSubmit;
		}
  }
	controller.init(view,model)
}