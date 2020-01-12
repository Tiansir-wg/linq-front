mui.init();

mui.plusReady(function() {
	var self = plus.webview.currentWebview();

	var username = self.username;

	var nickname = self.nickname;

	friend_operation_screen(username);

	sendMessage(username, nickname);

})

function friend_operation_screen(username) {
	mui("header").on("tap", "#shengluehao", function() {
		var action_sheet = plus.webview.create("action_sheet.html", "action_sheet", {
			background: 'transparent',
			zindex: 200
		});
		action_sheet.show("fade-in", 300);

	})
}

function sendMessage(username, nickname) {
	mui("#sendMessageUl").on("tap", "#sendMessageBtn", function() {
		mui.openWindow({
			url: "chat_screen.html",
			id: "chat_screen",
			extras: {
				username: username,
				nickname: nickname
			}

		});
	})
}
