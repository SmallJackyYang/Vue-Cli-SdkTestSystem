// //是否是生产环境的判断
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);

//引用gzip压缩js的方法
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = {
	publicPath:'./',  //资源路径 不改的话dist打包出来找不到资源
  // 选项
	lintOnSave: false,
	// 开发环境的服务器配置参数
	devServer: {  
		port: 8787,  //端口号
		index: 'login.html',  //默认打开的网页
		overlay: {
				warnings: false,
				errors: false
		},
	},
	//多页面配置
	pages: {
		index: {
    	entry: 'src/pages/app/main.js',                  //页面的入口文件
     	template: 'public/system.html',                   //页面的模板文件
     	filename: 'system.html'                           //页面的出口名称，即build生成的文件名称
	  },
	  login: {
     entry: 'src/pages/login/main.js',
     template: 'public/login.html',
     filename: 'login.html',
	  },
  },
	//修改favicon配置
	pwa: {
		iconPaths: {
			favicon32: 'favicon.ico',
			favicon16: 'favicon.ico',
			appleTouchIcon: 'favicon.ico',
			maskIcon: 'favicon.ico',
			msTileImage: 'favicon.ico'
		}
	},
	css: {
		extract: false
	},
	chainWebpack: config => {
		config.optimization.minimize(true);
	},
	//Webpack配置
	configureWebpack: config => {
		const plugins = [];
		//生产环境确认
		if (IS_PROD) {
			plugins.push(
				//gzip压缩
				new CompressionWebpackPlugin({
					filename: "[path].gz[query]",
					algorithm: "gzip",
					test: productionGzipExtensions,
					threshold: 10240,
					minRatio: 0.8
				})
			);
		}
		config.plugins = [...config.plugins, ...plugins];
	},
}