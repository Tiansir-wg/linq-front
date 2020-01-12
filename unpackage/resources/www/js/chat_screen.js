mui.init();

mui('.mui-switch')['switch']()

mui.plusReady(function() {

	// 获取当前页面对象
	var self = plus.webview.currentWebview();

	// 用户名
	var usernam = self.username;

	// 昵称
	var nickname = self.nickname;

	document.getElementById("nickname").innerText = nickname;

	mui("header").on("tap", "#shengluehao", function() {
		goToPersonMessageSetting();
	})

})

function goToPersonMessageSetting() {
	// 获取当前页面对象
	var self = plus.webview.currentWebview();

	// 用户账户
	var username = self.username;


	mui.openWindow({
		url: "person_message_setting.html",
		id: "person_message_setting",
		extras: {
			username: username
		}
	});

}
