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
							<span class="form-title">歌单名称：</span>
							<input type="text" placeholder="歌单名称" name="name" value="__name__">
						</label>
					</div>
					<div class="form-group">
						<label for="">
							<span class="form-title">播放量：</span>
							<input type="text" placeholder="播放量" name="amount" value="__amount__">
						</label>
          </div>
          <div class="form-group">
						<label for="">
							<span class="form-title">简介：</span>
							<input type="text" placeholder="简介" name="summary" value="__summary__">
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
					<div class="form-group select">
						<label for="">
							<span class="form-title">添加歌曲：</span>
              <div class="select-box">
                <div class="songs">
                  <ul id="selected">
                  </ul>
                </div>
                <span>&lt;=</span>
                <div class="songs list" id="songList">
                </div>
              </div>
						</label>
					</div>
					<div class="form-group submit">
						<button type="submit" class="save">保存</button>
					</div>
				</form>
			</div>
    `,
    liTpl:`
      <li>__song__ - __singer__</li>
    `,
    render(data = {}){
			let placeholders = ['name','url','singer','id','isNew','cover','lyrics','amount','summary'];
			let html = this.tpl;
			console.log(data);
			placeholders.map((str) => {
				if(str === 'isNew'){
					let title = data['isNew']? '新增歌单' : '编辑歌单';
					html = html.replace('__mode__',title);
				}else{
					html = html.replace(`__${str}__`,data[str] || '');
				}
				
			})
      $(this.el).html(html);
    },
    addSelect(data){
      console.log(data);
      let html = '';
      for(let i = 0;i<data.length;i++){
        html += this.liTpl.replace('__song__',data[i].name).replace('__singer__',data[i].singer);
      }
      $(this.el).find('#selected').html(html);
    },
		reset(data){
			let placeholders = ['name','cover','amount','summary'];
			for(let i = 0;i<placeholders.length;i++){
				$(this.el).find(`[name=${placeholders[i]}]`).val('')
			}
			$(this.el).find('#songList input').each((idx,item)=>{
				if($(item).prop('checked')){
					$(item).trigger('click');
				}
			})
		}
  }
  let model = {
		data:{
			isNew : true ,
			amount : '',			// 歌曲名称
      cover:'',			// 歌词
			songs:[],
			summary:''
		},
		createPlay(data){
			console.log('创建歌单数据')
			console.log(data);
      let playList = AV.Object.extend('playList');// 广东
			let playlist = new playList();
      for(var item in data){
        playlist.set(item,data[item]);
			}
			return playlist.save()
				.then((res) => {
					console.log('存储成功')
					console.log(res);
					let list = {
						id : res.id,
						...res.attributes
					}
					return list;
				})
      // for(let i = 0;i<data.songs.length;i++){
      //   let song = AV.Object.createWithoutData('Songs', data.songs[i].id);
      //   song.set('dependent', playlist);// 为广州设置 dependent 属性为广东
      //   song.save().then(function (song) {
			// 		console.log('新建关联')
			// 			console.log(song);
			// 			if(i === data.songs.length - 1){
			// 				window.eventHub.emit('createList')
			// 			}
			// 	});
				
      // }
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
				let names = ['name','cover','amount','summary'];
				if(!this.checkForm(names)){
					return false;
        }
        console.log(this.model.data);
        if(this.model.data.songs.length === 0){
          alert('请选择歌曲');
          return false;
        }
				let hash = {};
				names.map((item) => {
					hash[item] = this.view.$el.find(`[name="${item}"]`).val();
        })
        hash['songs'] = this.model.data.songs;
				console.log(hash);
				this.model.createPlay(hash)
					.then((res)=>{
						console.log('返回到 controller');
						console.log(res);
						window.eventHub.emit('createList',res);
						this.view.reset();
					});
				
			})
		},
		bindEventsHub(){
			window.eventHub.on('select',(data) => {
        // 上传文件后将文件信息赋值到表单
        console.log('接收数据')
        console.log(data);
        this.model.data.songs = data;
        this.view.addSelect(this.model.data.songs);
      })
      window.eventHub.on('uploadCover',(data)=>{
        this.model.data.cover = data.cover;
        $(this.view.el).find('input[name="cover"]').val(this.model.data.cover);
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