<template>
  <div id="app">
		<el-container style="height: 100%;" direction="vertical">
			<el-header style="text-align: left;">	
				<el-image style="width: 25px;height: 25px;vertical-align: middle;margin-bottom: 5px;" :src="require('../../static/img/logo3.png')"></el-image>				
				<span style="font-weight: bold;font-size: 120%;color: white;">数据比对系统</span>
				<span style="margin-left: 80%;font-size: 13px;color: white;">
				<!-- localStorage中保存的nickname，赋值到这里 -->
				<i class="el-icon-user-solid"></i>	
				欢迎你,{{header.nickname}}
				</span>
				<el-dropdown style="margin-left: 30px;">
				  <span class="el-dropdown-link" style="color: white;">
				    系统<i class="el-icon-arrow-down el-icon--right"></i>
				  </span>
				  <el-dropdown-menu slot="dropdown">
					<!-- 这里使用@click="exitconfirm",点击之后无反馈，不知道为啥要加一个native -->
				    <el-dropdown-item style="color: #409EFF;" @click.native="exitconfirm">安全退出</el-dropdown-item>    
				  </el-dropdown-menu>
				</el-dropdown>	
			</el-header>
			<el-container>	
				<el-aside  width="250px" style="border-right: 2px solid #cccacb;">
					<el-row class="tac">
					  <el-col :span="24" >
					    <el-menu :default-active="this.$route.path" class="el-menu-vertical-demo border" background-color="#E9EEF3" router >	
								<el-submenu index="1">
									<template slot="title" style="padding-left: 0;"><i class="el-icon-s-data"></i>数据比对</template>
										<el-menu-item index="/upcase"><i class="el-icon-upload"></i> 用例上传</el-menu-item>
										<el-menu-item index="/findcase"><i class="el-icon-folder"></i> 用例管理</el-menu-item>
								<el-submenu index="1-3">
									<template slot="title"><i class="el-icon-data-analysis"></i>Dana数据</template>
										<el-menu-item index="/paramscheck"> 数据查询</el-menu-item>
										<el-menu-item index="/gamesetting"> 游戏自定义事件配置</el-menu-item>
										<el-menu-item index="/redis"> SDK事件配置</el-menu-item>
									</el-submenu>
								</el-submenu>
								<el-menu-item index="/userdetail"><i class="el-icon-user"></i> 个人中心</el-menu-item>
					    </el-menu>
					  </el-col>
					</el-row>
				</el-aside>
				<el-main>
					<!-- 路由匹配到的组件将显示在这里 -->
				  <router-view></router-view>
				</el-main>	
			</el-container>
		</el-container>
  </div>
</template>

<script>
export default {
  name: 'app',
	data:function(){
		return{
			header:{
				nickname:localStorage.getItem("nickname"),
			},
		}
	},
	mounted() {
		//登录状态校验，没登录则退出弹出提示，到登录界面
		if (!localStorage.getItem("uid") || !localStorage.getItem("token")){
			this.$alert('当前处于未登录状态，请登录', '提示', {
			  confirmButtonText: '确定',
			  callback: action => {
				localStorage.clear()
				window.location.href = "./login.html"
			  }
			})		
		}
	},
	methods:{
		exitconfirm:function(){
			this.$confirm('此操作将退出当前系统, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				//点击确定后，发登出请求
				this.$http.get(process.env.VUE_APP_BASE_API_OA+'/userservice/user/logout',
				{params:{userId:localStorage.getItem("uid"),projectId:3},
				headers:{'Project-Id':'3','User-id':localStorage.getItem("uid"),'Kdc-token':localStorage.getItem("token")}}
				).then(function(res){
					//code = 0 代表 登出成功
					if (res.body.code == 0) {
						//登出成功，则清楚所有locastorage存储的信息，然后跳转登录界面
						localStorage.clear()
						window.location.href = "./login.html"
						}
				})
			}).catch(() => {
				return false    
			});
		}
	},
}
</script>