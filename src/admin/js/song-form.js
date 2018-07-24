{
  let view = {
    el : '.editbox',
    tpl : `
      <div class="box">
				<h4 class="title"><i class="iconfont icon-settings"></i> Edit Song</h4>
				<form action="">
					<div class="form-group">
						<label for="">
							<span class="form-title">歌曲名称：</span>
							<input type="text" placeholder="歌曲名称" required name="song">
						</label>
					</div>
					<div class="form-group">
						<label for="">
							<span class="form-title">歌手：</span>
							<input type="text" placeholder="歌手" required name="singer">
						</label>
					</div>
					<div class="form-group upload">
						<label for="">
							<span class="form-title">上传文件：</span>
							<div id="container">
								<button id="pickfiles"><i class="iconfont icon-cloudtouploadyunshangchuan"></i></button>
								<p class="tips">点击或拖拽文件，大小不超过 5 M</p>
							</div>
							<input type="hidden" name="songurl">
						</label>
					</div>
					<div class="form-group fileurl">
							<label for="">
								<span class="form-title">资源路径：</span>
								<input type="text" placeholder="资源路径" required readonly>
							</label>
						</div>
					<div class="form-group submit">
						<button class="save">保存</button>
						<button class="cancel">取消</button>
					</div>
				</form>
			</div>
    `,
    render(data){
      $(this.el).html(this.tpl);
    }
  }
  let model = {

  }
  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render(this.model.data);
    }
  }
	controller.init(view,model)
	window.app.editSong = controller;
}