mui.init();

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

});