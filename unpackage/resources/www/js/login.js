mui.plusReady(function() {

	//  设置沉浸式状态栏
	app.statusBarInit("#FFFFFF")

	// 判断用户是否注册登录过，如果本地内存有全局的用户对象，此时直接跳转到首页
	// var userInfo = app.getUserGlobalInfo();
	// if (userInfo != null) {
	// 	// 页面跳转
	// 	mui.openWindow("index.html", "index.html");
	// }

	var userform = document.getElementById("userform");
	var username = document.getElementById("username");
	var userpassword = document.getElementById("userpassword");

	userform.addEventListener("submit", function(e) {
		// 判断用户名是否为空，如果为空则让其获得焦点
		if (!app.isNotNull(username.value)) {
			// 获取焦点
			username.focus();
			app.showToast("用户名不能为空", "close-circle");

			return false;
		} else if (!app.isNotNull(userpassword.value)) {
			// 获取焦点
			userpassword.focus();
			app.showToast("密码不能为空", "close-circle");

			return false;
		} else {
			// 判断用户名和密码的长度，进行限制
			if (username.value.length > 10) {
				app.showToast("用户名长度不能超过10", "close-circle");
				return false;
			} else if (userpassword.value.length > 12) {
				app.showToast("密码长度不能超过12", "close-circle");
				return false;
			}


		}
		var params = {
			"username": username.value,
			"password": userpassword.value
		}
		
	    //alert(app.baseUrl() + "login");
		//http://183.168.134.114:8080//login
		mui.ajax(app.baseUrl() + "login", {
			data: params,
			crossDomain: true,
		    dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: function(data) {
				if (data.code == 200) {
					app.saveGlobalUserInfo(data.data);
					mui.openWindow("../index.html", "../index.html");
				}
			},
			error: function() {
				app.showToast("出了一点儿小问题~~", "close-circle");
			}
		});
		// 阻止默认表单提交
		e.preventDefault();
	});
});
