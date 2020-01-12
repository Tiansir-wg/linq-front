// 消息类型：群组消息、私人消息、登录消息、发送给自己的消息、图片消息
window.messagetype = {
	GROUP_MESSAGE: "sendGroup",
	LOGIN_MESSAGE: "login",
	P2P_MESSAGE: "sendTo",
	PICTURE_MESSAGE: "sendMe"
}
// 封装聊天对象
window.chatobject = {

	socket: null,

	/**
	 * @param {Object} type 消息类型：群组消息、私人消息、登录消息、发送给自己的消息、图片消息
	 * @param {Object} token 个人的标识，此处是用户名
	 * @param {Object} to 当类型是群组消息时此字段表示组id,当类型是私人消息时表示消息接收者标识，当登录消息时无意义
	 * @param {Object} value  具体的消息内容
	 */
	message: function(type, token, value, to) {
		this.type = type;
		this.token = token;
		this.value = value;
		this.to = to;
	},

	// 初始化操作，websocket及其相关事件处理函数的绑定
	init: function() {
		if (window.WebSocket) {

			// 如果当前的状态已经连接，那就不需要重复初始化websocket
			if (chatobject.socket != null &&
				chatobject.socket != undefined &&
				chatobject.socket.readyState == WebSocket.OPEN) {
				return false;
			}

			chatobject.socket = new WebSocket(app.nettyServerUrl);
			chatobject.socket.onopen = chatobject.onopen,
				chatobject.socket.onclose = chatobject.onclose,
				chatobject.socket.onerror = chatobject.onerror,
				chatobject.socket.onmessage = chatobject.onmessage;
		} else {
			alert("手机设备过旧，请升级手机设备...");
		}
	},

	// 发送消息事件
	send: function(msg) {

		// 如果当前websocket的状态是已打开，则直接发送， 否则重连
		if (chatobject.socket != null &&
			chatobject.socket != undefined &&
			chatobject.socket.readyState == WebSocket.OPEN) {
			//console.log(msg);
			chatobject.socket.send(msg);
		} else {
			// 重连websocket
			chatobject.init();
			setTimeout("chatobject.resend('" + msg + "')", "1000");
		}
		// 渲染快照列表进行展示
		loadingChatSnapshot();
	},

	// 重新发送消息
	resend: function(msg) {
		console.log("消息重新发送...");
		chatobject.socket.send(msg);
	},

	// 打开连接事件
	onopen: function() {
		//console.log("websocket连接已建立...");

		var me = app.getGlobalUserInfo();

		//console.log(me.username);

		// 构建登录消息
		var loginmsg = new chatobject.message(messagetype.LOGIN_MESSAGE, me.username, "", "");

		// 发送登录消息
		chatobject.send(JSON.stringify(loginmsg));


		// 每次连接之后，获取用户的未读未签收消息列表
		// fetchUnReadMsg();

		// 定时发送心跳
		//setInterval("chatobject.keepalive()", 10000);


	},
	onmessage: function(e) {
		//console.log("接收到消息：" + e.data + "\n");

		var callback_data = JSON.parse(e.data);
		var type = callback_data.type;

		var msg = callback_data.value;
		if (type == "login") {
			return;
		} else {
			var friendUserId = callback_data.from;

			var chatWebview = plus.webview.getWebviewById("chatting-" + friendUserId);
			var isRead = true; // 设置消息的默认状态为已读
			if (chatWebview != null) {
				chatWebview.evalJS("receiveMsg('" + msg + "')");
				chatWebview.evalJS("resizeScreen()");
			} else {
				isRead = false; // chatWebview 聊天页面没有打开，标记消息未读状态
			}

			// 保存聊天历史记录到本地缓存
			app.saveUserChatHistory(app.getGlobalUserInfo().username, friendUserId, msg, 2);
			app.saveUserChatSnapshot(app.getGlobalUserInfo().username, friendUserId, msg, isRead);

			//console.log(JSON.stringify(app.getUserChatSnapshot("HK334413"))+"~~~~~~~~~~~~~~~");
			// 		// 渲染快照列表进行展示
			app.loadingChatSnapshot();
		}


	},
	onclose: function() {
		console.log("连接关闭...");
	},
	onerror: function() {
		console.log("发生错误...");
	},
	signMsgList: function(unSignedMsgIds) {
		// 构建批量签收对象的模型
		var dataContentSign = new app.DataContent(app.SIGNED,
			null,
			unSignedMsgIds);
		// 发送批量签收的请求
		CHAT.send(JSON.stringify(dataContentSign));
	},
	keepalive: function() {
		// 构建对象
		var dataContent = new app.DataContent(app.KEEPALIVE, null, null);
		// 发送心跳
		CHAT.send(JSON.stringify(dataContent));

		// 定时执行函数
		fetchUnReadMsg();
		fetchContactList();
	}
};
