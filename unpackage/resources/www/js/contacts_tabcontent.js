mui.init();

mui.plusReady(function() {
	goToFriendDetails();
})

function goToFriendDetails() {
	mui("ul").on("tap", "a", function() {
		var username = this.getAttribute("username");

		var nickname = this.getAttribute("nickname");
	

		mui.openWindow({
			url: "friend_detail.html",
			id: "friend_detail",
			extras: {
				username: username,
				nickname: nickname
			}
		});

	})
}
