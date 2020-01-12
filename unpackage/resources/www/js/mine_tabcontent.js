mui.init();



mui.plusReady(function() {
	mui(".mui-card-header").on('tap', '#xiangji', function() {
		app.capturePicture(1);
	});
})
