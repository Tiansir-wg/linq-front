mui.init();

function goToChatScreen() {
	mui("ul").on("tap", "li", function() {

		// 账户名，唯一
		var id = this.getAttribute("id");

		// 昵称
		var nickname = this.getAttribute("name");


		mui.openWindow({
			url: "chat_screen.html",
			id: "chat_screen",
			extras: {
				nickname:nickname,
				username:id
			}
		});

		//alert(id + nickname);
	})
}

mui.plusReady(function() {
	goToChatScreen();
})
