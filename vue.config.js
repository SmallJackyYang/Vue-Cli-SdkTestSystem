// vue.config.js
module.exports = {
  // 选项
	lintOnSave: false,
	devServer: {
		port: 8787,
		index: 'login.html',
		overlay: {
				warnings: false,
				errors: false
		},
	},
	pages: {
		index: {
    	entry: 'src/pages/app/main.js',                  //页面的入口文件
     	template: 'public/index.html',                   //页面的模板文件
     	filename: 'index.html'                           //页面的出口名称，即build生成的文件名称
	  },
	  login: {
     entry: 'src/pages/login/main.js',
     template: 'public/login.html',
     filename: 'login.html',
	  },
  },
	pwa: {
		iconPaths: {
				favicon32: 'favicon.ico',
				favicon16: 'favicon.ico',
				appleTouchIcon: 'favicon.ico',
				maskIcon: 'favicon.ico',
				msTileImage: 'favicon.ico'
		}
	}
}