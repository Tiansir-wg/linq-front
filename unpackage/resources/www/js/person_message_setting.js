mui.init();


mui.plusReady(function() {
	render();

	mui("ul").on("tap", "img", function() {
		var username = this.getAttribute("username");
		var nickname = this.getAttribute("nickname");
		
		mui.openWindow("friend_detail.html", "friend_detail.html")

	})
})

function render() {
	// 获取当前页面对象
	var self = plus.webview.currentWebview();

	// 用户账户
	var username = self.username;

}
