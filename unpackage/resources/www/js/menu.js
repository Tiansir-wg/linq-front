mui.init({
	// preloadPages: [{
	// 	id: 'tab-webview-main.html',
	// 	url: 'tab-webview-main.html'
	// }]
});

mui.plusReady(function() {
	ws = plus.webview.currentWebview();
	ws.setStyle({
		mask: "none"
	});
	window.addEventListener("tap", function() {
		ws.hide();
	});
	window.addEventListener("dragstart", function() {
		ws.hide();
	});

	addFriend();
	
	scan()
	
	paypal();
	
	help();

});


/**
 * 添加好友
 */
function addFriend() {
	mui(".mui-table-view").on("tap", "#addfriend", function(e) {
		
		e.detail.gesture.preventDefault();
		
		var selfPage = plus.webview.currentWebview();

		var openerPage = selfPage.opener();

		selfPage.close();

		openerPage.show();
	})
}

/**
 * 扫一扫
 */
function scan(){
	mui(".mui-table-view").on("tap", "#scan", function(e) {
		
		e.detail.gesture.preventDefault();
		
		var selfPage = plus.webview.currentWebview();
	
		var openerPage = selfPage.opener();
	
		selfPage.close();
	
		openerPage.show();
	})
}

/**
 * 收付款
 */
function help(){
	mui(".mui-table-view").on("tap", "#paypal", function(e) {
		
		e.detail.gesture.preventDefault();
		
		var selfPage = plus.webview.currentWebview();
	
		var openerPage = selfPage.opener();
	
		selfPage.close();
	
		openerPage.show();
	})
}

/**
 * 帮助与反馈
 */
function paypal(){
	mui(".mui-table-view").on("tap", "#help", function(e) {
		
		e.detail.gesture.preventDefault();
		
		var selfPage = plus.webview.currentWebview();
	
		var openerPage = selfPage.opener();
	
		selfPage.close();
	
		openerPage.show();
	})
}

