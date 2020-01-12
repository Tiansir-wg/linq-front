window.app = {
	
	baseUrl: function(){
		return "http://183.168.134.114/";
	},

	/**
	 * 判断字符串是够不为空，返回TRUE表不空
	 * @param {Object} str
	 */
	isNotNull: function(str) {
		if (str != null && str != "" && str != undefined) {
			return true;
		}
		return false;
	},

	/**
	 * 显示通知面板
	 * @param {Object} msg
	 * @param {Object} name
	 */
	showToast: function(msg, name) {
		plus.nativeUI.toast(msg, {
			icon: "../images/" + name + ".jpg",
			verticalAlign: "center"
		});
	},

	/**
	 * 保存用户的全局信息
	 * @param {Object} user
	 */
	saveGlobalUserInfo: function(user) {
		// 字符串化
		var userInfoStr = JSON.stringify(user);
		// 保存全局信息

		plus.storage.setItem("userinfo", userInfoStr);

	},

	/**
	 * 获取用户的全局信息
	 * @param {Object} user
	 */
	getGlobalUserInfo: function() {
		return plus.storage.getItem("userinfo");
	},

	/**
	 * 状态栏沉浸式设置
	 * @param {Object} barcolor
	 */
	statusBarInit: function(barcolor) {
		// 设置背景色
		plus.navigator.setStatusBarBackground(barcolor);

		// 设置字体颜色
		plus.navigator.setStatusBarStyle("light")
	},
	
	/**
	 * 使用指定的摄像头拍照，index = 1表示主摄像头，index = 2 表示副摄像头
	 * @param {Object} index
	 */
	capturePicture:function(index){
		// 获取设备默认的摄像头对象
		var camera = plus.camera.getCamera(index);
		
		// 调用摄像头抓取照片
		camera.captureImage(function(path){
			app.showToast("照片已保存到"+path,"success");
		},function(error){
			app.showToast("出现了一点儿小问题~~"+error.message,"error")
		},{
			resolution:"*",
			format:"jpg"
		})
		
	}

}
