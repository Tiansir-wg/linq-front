window.app = {

	baseUrl: function() {
		return "http://192.168.43.103:8080/";
	},

	// 图片服务器的地址
	//imgServerUrl : "http://183.168.135.93:8080/",
	imgServerUrl: "http://118.24.216.208:8000/group2/",

	// websocket netty服务器地址
	nettyServerUrl: 'ws://192.168.43.103:8090/ws',
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
		return JSON.parse(plus.storage.getItem("userinfo"));
	},

	removeGlobalUserInfo: function() {
		plus.storage.removeItem("userInfo");
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
	capturePicture: function(index) {
		// 获取设备默认的摄像头对象
		var camera = plus.camera.getCamera(index);

		// 调用摄像头抓取照片
		camera.captureImage(function(path) {
			app.showToast("照片已保存到" + path, "success");
		}, function(error) {
			app.showToast("出现了一点儿小问题~~" + error.message, "error")
		}, {
			resolution: "*",
			format: "jpg"
		})

	},

	get: function(id) {
		return document.getElementById(id);
	},

	// 获取联系人列表
	getContactList: function() {
		var friends = JSON.parse(plus.storage.getItem("contacts"));
		if (!app.isNotNull(friends)) {
			friends = [];
		}
		return friends;
	},

	// 清空联系人列表 
	clearContactLis: function() {
		plus.storage.removeItem("contacts");
	},
	/**
	 * 获取用户聊天记录
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	getUserChatHistory: function(myId, friendId) {
		var me = this;
		var chatKey = "chat-" + myId + "-" + friendId;
		var chatHistoryListStr = plus.storage.getItem(chatKey);
		var chatHistoryList;
		if (me.isNotNull(chatHistoryListStr)) {
			// 如果不为空
			chatHistoryList = JSON.parse(chatHistoryListStr);
		} else {
			// 如果为空，赋一个空的list
			chatHistoryList = [];
		}

		return chatHistoryList;
	},

	// 删除我和朋友的聊天记录
	deleteUserChatHistory: function(myId, friendId) {
		var chatKey = "chat-" + myId + "-" + friendId;
		plus.storage.removeItem(chatKey);
	},

	/**
	 * 聊天记录的快照，仅仅保存每次和朋友聊天的最后一条消息
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} isRead
	 */
	saveUserChatSnapshot: function(myId, friendId, msg, isRead) {
		var me = this;
		var chatKey = "chat-snapshot" + myId;

		// 从本地缓存获取聊天快照的list
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList;
		if (me.isNotNull(chatSnapshotListStr)) {
			// 如果不为空
			chatSnapshotList = JSON.parse(chatSnapshotListStr);

			console.log("修改之前" + chatSnapshotListStr);
			// 循环快照list，并且判断每个元素是否包含（匹配）friendId，如果匹配，则删除
			for (var i = 0; i < chatSnapshotList.length; i++) {
				if (chatSnapshotList[i].friendId == friendId) {
					// 删除已经存在的friendId所对应的快照对象
					chatSnapshotList.splice(i, 1);
					break;
				}
			}
		} else {
			// 如果为空，赋一个空的list
			chatSnapshotList = [];
		}

		// 构建聊天快照对象
		var singleMsg = new me.ChatSnapshot(myId, friendId, msg, isRead);

		// 向list中追加快照对象
		chatSnapshotList.unshift(singleMsg);

		console.log("修改之后" + JSON.stringify(chatSnapshotList));

		plus.storage.setItem(chatKey, JSON.stringify(chatSnapshotList));
	},

	/**
	 * 获取用户快照记录列表
	 */
	getUserChatSnapshot: function(myId) {
		var me = this;
		var chatKey = "chat-snapshot" + myId;
		// 从本地缓存获取聊天快照的list
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList;
		if (me.isNotNull(chatSnapshotListStr)) {
			// 如果不为空
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
		} else {
			// 如果为空，赋一个空的list
			chatSnapshotList = [];
		}

		return chatSnapshotList;
	},

	/**
	 * 删除本地的聊天快照记录
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	deleteUserChatSnapshot: function(myId, friendId) {
		var me = this;
		var chatKey = "chat-snapshot" + myId;

		// 从本地缓存获取聊天快照的list
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList;
		if (me.isNotNull(chatSnapshotListStr)) {
			// 如果不为空
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
			// 循环快照list，并且判断每个元素是否包含（匹配）friendId，如果匹配，则删除
			for (var i = 0; i < chatSnapshotList.length; i++) {
				if (chatSnapshotList[i].friendId == friendId) {
					// 删除已经存在的friendId所对应的快照对象
					chatSnapshotList.splice(i, 1);
					break;
				}
			}
		} else {
			// 如果为空，不做处理
			return;
		}

		plus.storage.setItem(chatKey, JSON.stringify(chatSnapshotList));
	},

	/**
	 * 标记未读消息为已读状态
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	readUserChatSnapshot: function(myId, friendId) {
		var me = this;
		var chatKey = "chat-snapshot" + myId;
		// 从本地缓存获取聊天快照的list
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList;
		if (me.isNotNull(chatSnapshotListStr)) {
			// 如果不为空
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
			// 循环这个list，判断是否存在好友，比对friendId，
			// 如果有，在list中的原有位置删除该 快照 对象，然后重新放入一个标记已读的快照对象
			for (var i = 0; i < chatSnapshotList.length; i++) {
				var item = chatSnapshotList[i];
				if (!app.isNotNull(item.friendId)) {
					continue;
				}
				if (item.friendId == friendId) {
					item.isRead = true; // 标记为已读
					chatSnapshotList.splice(i, 1, item); // 替换原有的快照
					break;
				}
			}
			// 替换原有的快照列表
			plus.storage.setItem(chatKey, JSON.stringify(chatSnapshotList));
			console.log("jjjjj" + JSON.stringify(chatSnapshotList));

		} else {
			// 如果为空
			return;
		}
	},

	/**
	 * 和后端的枚举对应
	 */
	CONNECT: 1, // 第一次(或重连)初始化连接
	CHAT: 2, // 聊天消息
	SIGNED: 3, // 消息签收
	KEEPALIVE: 4, // 客户端保持心跳
	PULL_FRIEND: 5, // 重新拉取好友

	/**
	 * 和后端的 ChatMsg 聊天模型对象保持一致
	 * @param {Object} senderId
	 * @param {Object} receiverId
	 * @param {Object} msg
	 * @param {Object} msgId
	 */
	ChatMsg: function(senderId, receiverId, msg, msgId) {
		this.senderId = senderId;
		this.receiverId = receiverId;
		this.msg = msg;
		this.msgId = msgId;
	},

	/**
	 * 构建消息 DataContent 模型对象
	 * @param {Object} action
	 * @param {Object} chatMsg
	 * @param {Object} extand
	 */
	DataContent: function(action, chatMsg, extand) {
		this.action = action;
		this.chatMsg = chatMsg;
		this.extand = extand;
	},

	/**
	 * 单个聊天记录的对象
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} flag
	 */
	ChatHistory: function(myId, friendId, msg, flag) {
		this.myId = myId;
		this.friendId = friendId;
		this.msg = msg;
		this.flag = flag;
	},

	/**
	 * 快照对象
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} isRead	用于判断消息是否已读还是未读
	 */
	ChatSnapshot: function(myId, friendId, msg, isRead) {
		this.myId = myId;
		this.friendId = friendId;
		this.msg = msg;
		this.isRead = isRead;
	},

	/**
	 * 保存用户的聊天记录
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} flag	判断本条消息是我发送的，还是朋友发送的，1:我  2:朋友
	 */
	saveUserChatHistory: function(myId, friendId, msg, flag) {
		var me = this;
		var chatKey = "chat-" + myId + "-" + friendId;

		// 从本地缓存获取聊天记录是否存在
		var chatHistoryListStr = plus.storage.getItem(chatKey);
		var chatHistoryList;
		if (me.isNotNull(chatHistoryListStr)) {
			// 如果不为空
			chatHistoryList = JSON.parse(chatHistoryListStr);
		} else {
			// 如果为空，赋一个空的list
			chatHistoryList = [];
		}

		// 构建聊天记录对象
		var singleMsg = new me.ChatHistory(myId, friendId, msg, flag);

		// 向list中追加msg对象
		chatHistoryList.push(singleMsg);

		plus.storage.setItem(chatKey, JSON.stringify(chatHistoryList));
	},
	/**
	 * 获取用户聊天记录
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	getUserChatHistory: function(myId, friendId) {
		var me = this;
		var chatKey = "chat-" + myId + "-" + friendId;
		var chatHistoryListStr = plus.storage.getItem(chatKey);
		var chatHistoryList;
		if (me.isNotNull(chatHistoryListStr)) {
			// 如果不为空
			chatHistoryList = JSON.parse(chatHistoryListStr);
		} else {
			// 如果为空，赋一个空的list
			chatHistoryList = [];
		}

		return chatHistoryList;
	},

	// 删除我和朋友的聊天记录
	deleteUserChatHistory: function(myId, friendId) {
		var chatKey = "chat-" + myId + "-" + friendId;
		plus.storage.removeItem(chatKey);
	},

	/**
	 * 获取用户快照记录列表
	 */
	getUserChatSnapshot: function(myId) {
		var me = this;
		var chatKey = "chat-snapshot" + myId;
		// 从本地缓存获取聊天快照的list
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList;
		if (me.isNotNull(chatSnapshotListStr)) {
			// 如果不为空
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
		} else {
			// 如果为空，赋一个空的list
			chatSnapshotList = [];
		}

		return chatSnapshotList;
	},

	/**
	 * 删除本地的聊天快照记录
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	deleteUserChatSnapshot: function(myId, friendId) {
		var me = this;
		var chatKey = "chat-snapshot" + myId;

		// 从本地缓存获取聊天快照的list
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList;
		if (me.isNotNull(chatSnapshotListStr)) {
			// 如果不为空
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
			// 循环快照list，并且判断每个元素是否包含（匹配）friendId，如果匹配，则删除
			for (var i = 0; i < chatSnapshotList.length; i++) {
				if (chatSnapshotList[i].friendId == friendId) {
					// 删除已经存在的friendId所对应的快照对象
					chatSnapshotList.splice(i, 1);
					break;
				}
			}
		} else {
			// 如果为空，不做处理
			return;
		}

		plus.storage.setItem(chatKey, JSON.stringify(chatSnapshotList));
	},
	// 展示聊天快照，渲染列表
	loadingChatSnapshot: function() {
		var user = app.getGlobalUserInfo();
		var chatSnapshotList = app.getUserChatSnapshot(user.username);

		var chatItemHtml = "";
		var ul_chatSnapshot = document.getElementById("ul_chatSnapshot");
		if(!app.isNotNull(ul_chatSnapshot)){
			return;
		}
		ul_chatSnapshot.innerHTML = "";
		for (var i = 0; i < chatSnapshotList.length; i++) {
			var chatItem = chatSnapshotList[i];

			var friendId = chatItem.friendId;


			if (!app.isNotNull(friendId)) {
				continue;
			}

			// 根据friendId从本地联系人列表的缓存中拿到相关信息
			var friend = app.getFriendFromContactList(friendId);
			
			if(!app.isNotNull(friend)){
				return false;
			}

			//console.log("与我聊天的好友"+ JSON.stringify(friend));

			// 判断消息的已读或未读状态
			var isRead = chatItem.isRead;
			var readHtmlBefore = '';
			var readHtmlAfter = '';
			if (!isRead) {
				readHtmlBefore = '<span class="red-point">';
				readHtmlAfter = '</span>';
			}

			chatItemHtml = '<li friendUserId="' + friendId + '" friendNickname="' + friend.nickname +
				'" friendFaceImage="' + friend.faceimg_sm + '" class="chat-with-friend mui-table-view-cell mui-media">' +
				'<div class="mui-slider-right mui-disabled">' +
				'<a id="link_delChatRecord" friendUserId="' + friendId + '" class="mui-btn mui-btn-red">删除</a>' +
				'</div>' +
				'<div class="mui-slider-handle mui-media-body ">' +
				'<img class="mui-media-object mui-pull-left" src="' + app.imgServerUrl + friend.faceimg_sm + '"/>' +
				readHtmlBefore + friend.nickname + readHtmlAfter +
				'<p class="mui-ellipsis">' + chatItem.msg + '</p>' +
				'</div>' +
				'</li>';
			ul_chatSnapshot.insertAdjacentHTML('beforeend', chatItemHtml);
		}

	},

	/**
	 * 保存用户的联系人列表
	 * @param {Object} contactList
	 */
	setContactList: function(contactList) {
		var contactListStr = JSON.stringify(contactList);
		plus.storage.setItem("contactList", contactListStr);
	},
	removeContactList: function() {
		plus.storage.removeItem("contactList");
	},


	/**
	 * 获取本地缓存中的联系人列表
	 */
	getContactList: function() {
		var contactListStr = plus.storage.getItem("contactList");

		if (!this.isNotNull(contactListStr)) {
			return [];
		}

		return JSON.parse(contactListStr);
	},

	/**
	 * 根据用户id，从本地的缓存（联系人列表）中获取朋友的信息
	 * @param {Object} friendId
	 */
	getFriendFromContactList: function(friendId) {
		var contactListStr = plus.storage.getItem("contactList");


		// 判断contactListStr是否为空
		if (this.isNotNull(contactListStr)) {
			// 不为空，则把用户信息返回
			var contactList = JSON.parse(contactListStr);
			for (var i = 0; i < contactList.length; i++) {
				var friend = contactList[i];
				if (friend.username == friendId) {
					return friend;
					break;
				}
			}
		} else {
			// 如果为空，直接返回null
			return null;
		}
	}

}
