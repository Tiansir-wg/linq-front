mui.init();

// 定义页面对象数组
var tabs_array = [{
		pageId: "linq_tabcontent.html",
		pageUrl: "html/linq_tabcontent.html"
	},
	{
		pageId: "contacts_tabcontent.html",
		pageUrl: "html/contacts_tabcontent.html"
	},
	{
		pageId: "discover_tabcontent.html",
		pageUrl: "html/discover_tabcontent.html"
	},
	{
		pageId: "mine_tabcontent.html",
		pageUrl: "html/mine_tabcontent.html"
	}
];

// tab页面初始化，为主界面添加tab
function tabsInit(tabs) {

	// 样式
	var style = {
		top: "44px",
		bottom: "50px"
	};


	// 获取主界面webview对象
	var indexWebView = plus.webview.currentWebview();

	// 为主界面添加四个附加界面
	for (var i = 0; i < tabs.length; i++) {

		// 创建附加界面
		var extraView = plus.webview.create(tabs[i].pageUrl, tabs[i].pageId, style);

		//  默认隐藏
		extraView.hide();

		// 添加为主界面的子界面 
		indexWebView.append(extraView);
	}

	// 显示主界面
	plus.webview.show(tabs[0].pageId);
}

//


// 为每个 tab 添加触摸事件绑定
function addTapEvent(tabs){
	mui('.mui-bar-tab').on('tap','a',function(){
		
		// 获取添加的 tabIndex 属性
	  var tabindex =  this.getAttribute("tabindex");
	  
	  // 显示当前 webview,隐藏其他 webview
	  plus.webview.show(tabs[tabindex].pageId,"fade-in",200);
	  
	  for(var i = 0;i < tabs.length;i++){
		  if(tabindex != i){
			  plus.webview.hide(tabs[i].pageId,"fade-out",200);
		  }
	  }
	  
	}) 
}
// 移动设备就绪完毕之后进行的操作,plus代表手机设备 
mui.plusReady(function() {
	
	// 设置沉浸式状态栏
	app.statusBarInit("#c14f4f")
	
	// 为主界面添加选项卡内容
	tabsInit(tabs_array);
	
	// 为选项卡添加触摸事件
	addTapEvent(tabs_array);
	
	bindWindow();
	
})

/**
 * 为菜单按钮绑定触摸事件，触摸式弹出窗口
 */
function bindWindow(){
	mui(".mui-bar").on('tap','#menu',function(){
		var menuWebview = plus.webview.create("html/menu.html","html/menu.html",{
			background:'transparent',
			zindex:200
		});
		menuWebview.show("fade-in",300);
	})
}