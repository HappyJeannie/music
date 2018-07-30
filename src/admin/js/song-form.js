{
  let view = {
		el : '.editbox',
		init(){
			this.$el = $(this.el)
		},
    tpl : `
      <div class="box">
				<h4 class="title"><i class="iconfont icon-settings"></i> __mode__</h4>
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
							<span class="form-title">上传歌曲：</span>
							<div id="containerSong">
								<button type="button" class="pickfiles"><i class="iconfont icon-cloudtouploadyunshangchuan"></i></button>
								<p class="tips">点击或拖拽文件，大小不超过 5 M</p>
							</div>
							<input type="hidden" name="songurl">
						</label>
					</div>
					<div class="form-group fileurl">
							<label for="">
								<span class="form-title">歌曲路径：</span>
								<input type="text" placeholder="歌曲路径" readonly value="__url__" name="url">
							</label>
						</div>
					<div class="form-group upload">
						<label for="">
							<span class="form-title">上传封面：</span>
							<div id="containerCover">
								<button type="button" class="pickfiles"><i class="iconfont icon-cloudtouploadyunshangchuan"></i></button>
								<p class="tips">点击或拖拽文件，大小不超过 10 M</p>
							</div>
							<input type="hidden" name="coverurl">
						</label>
					</div>
					<div class="form-group fileurl">
							<label for="">
								<span class="form-title">封面路径：</span>
								<input type="text" placeholder="封面路径" readonly value="__cover__" name="cover">
							</label>
						</div>
					<div class="form-group lyrics">
						<label for="">
							<span class="form-title">歌词：</span>
							<textarea placeholder="歌词" name="lyrics" noresize>__lyrics__</textarea>
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
			let placeholders = ['name','url','singer','id','isNew','cover','lyrics'];
			let html = this.tpl;
			console.log(data);
			placeholders.map((str) => {
				if(str === 'isNew'){
					let title = data['isNew']? 'Add Song' : 'Edit Song';
					html = html.replace('__mode__',title);
				}else{
					html = html.replace(`__${str}__`,data[str] || '');
				}
				
			})
      $(this.el).html(html);
		},
		reset(data){
			this.render(data || {});
		}
  }
  let model = {
		data:{
			isNew : true ,
			name : '',			// 歌曲名称
			url : '',				// 歌曲地址
			singer : '',		// 歌手
			id : '',					// 数据库中的id
			cover : '',				// 歌曲的封面
			lyrics : '' 			// 歌词
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
					that.data = {
						id,
						...song.attributes
					}
					resolve(that.data);
					
					//that.view.render({})
				}, function (error) {
					reject(error);
				});
			})
		},
		editSong(songInfo){
			console.log(songInfo)
			// 保存到云端
			let { tableName , name ,id ,singer,url,cover,lyrics} = songInfo;
			// 第一个参数是 className，第二个参数是 objectId
			let song = AV.Object.createWithoutData(tableName, id);
			// 修改属性
			for(let key in songInfo){
				if(key!= 'id' && key != 'tableName'){
					song.set(key,songInfo[key]);
				}
			}
			let that = this;
			return new Promise((resolve,reject) => {
				
				song.save().then(
					(song) => {
						let id = song.id;
						console.log('更新成功')
						console.log(song)
						console.log(that.data);
						that.data = {
							id,
							...song.attributes
						}
						resolve(that.data);
					},
					(error) => {
						reject(error);
					}
				)
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
			this.bindEventsHub();
		},
		bindEvents(){
			this.view.$el.on('submit','form',(e)=>{
				alert('表单提交了')
				e.preventDefault();
				let names = ['name','singer','url','cover','lyrics'];
				if(!this.checkForm(names)){
					return false;
				}
				let hash = {};
				names.map((item) => {
					hash[item] = this.view.$el.find(`[name="${item}"]`).val();
				})
				console.log(hash);
				if(this.model.data.isNew){
					alert('新增数据')
					this.model.createSong(hash)
					.then((res) => {
						console.log('添加完了之后的操作')
						console.log(res);
						this.view.reset();
						window.eventHub.emit('create',res)
					});
				}else{
					alert('编辑数据')
					hash.id = this.model.data.id;
					hash.tableName = 'Songs';
					this.model.editSong(hash)
					.then((res) => {
						console.log('编辑完了之后的操作')
						console.log(res);
						this.model.data.isNew = true;
						this.view.reset({'isNew':true});
						window.eventHub.emit('update',res);
					});
				}
				
				
			})
		},
		bindEventsHub(){
			window.eventHub.on('uploadSong',(data) => {
				// 上传文件后将文件信息赋值到表单
				console.log(this.model.data);
				console.log('song from 模块得到了歌曲 data')
				console.log(data);
				Object.assign(this.model.data,data);
				this.view.render(this.model.data);
				console.log(this.model.data);
			})

			window.eventHub.on('edit',(data) => {
				// 编辑文件后 表单接收数据
				console.log('表单数据');
				console.log(data);
				Object.assign(this.model.data,data);
				this.view.render(this.model.data);
				
			})
			window.eventHub.on('uploadCover',(data) => {
				// 上传文件后将文件信息赋值到表单
				console.log(this.model.data);
				console.log('song from 模块得到了封面 data')
				console.log(data);
				Object.assign(this.model.data,data);
				this.view.render(this.model.data);
				console.log(this.model.data);
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