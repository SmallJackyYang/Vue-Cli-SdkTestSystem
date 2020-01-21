<template>
	<div id="system-header">
		<el-container>
			<el-header style="text-align: left;">
				<el-image style="width: 25px;height: 25px;vertical-align: middle;margin-bottom: 5px;" :src="require('../../static/img/logo3.png')"></el-image>				
				<span style="font-weight: bold;font-size: 120%;color: floralwhite;">数据比对系统</span>
			</el-header>
		</el-container>
			<div id= "login" class="warp-login">
				<div class="hero-unit">
					<h3 style="color: #409EFF;margin-left: 180px;">OA账户登录</h3>
					<el-divider></el-divider>
					<!-- 表单包含验证机制rules,表单绑定的表格数据在ruleForm中 -->
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
						<el-form-item label="用户名" prop="username">
							<el-input v-model="ruleForm.username" placeholder="请输入OA账户" clearable></el-input>
						</el-form-item>
						<el-form-item label="密码" prop="password">
							<el-input type="password" v-model="ruleForm.password" placeholder="请输入密码" clearable show-password></el-input>
						</el-form-item>
						<el-form-item>
						<!-- 记住密码，使用checkbox进行判断 -->
						<el-checkbox v-model="ruleForm.checked">记住密码</el-checkbox>
						</el-form-item>	
						<el-form-item style="margin-top: 25px;" >
							<el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
							<el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
	</div>
</template>

<script>
import CryptoJS from 'crypto-js'
export default {
  name: 'system-header',
	data: function(){
		return{
			ruleForm: {
			  username: '',
			  password: '',
			  checked: false
			},
			//输入条件验证
			rules:{
				//用户名输入条件验证
				username:[
					{required:true,message:'用户名不能为空',trigger:'blur'},
				],
				//密码输入条件验证
				password:[
					{required:true,message:'密码不能为空',trigger:'blur'},
					{min: 6, message: '密码必须大于5位', trigger: 'blur' }			
				]
			},
		}
	},
	mounted() {
		//挂在页面之后判断是否有cookie记录，有的话，执行getCookie函数，没有，则直接跳过
		if (document.cookie.length > 0){
			this.ruleForm.checked = true
			this.getCookie()
		}
	},
	methods:{
		//登录请求
		submitForm:function(formName) {
		//输入条件都通过验证，才进行请求，否则，界面显示对应的提示
		  this.$refs[formName].validate((valid) => {
		    if (valid) {
			//AES加密
			var password = CryptoJS.AES.encrypt(this.ruleForm.password,'43f24a7ee1e03566307d11bd41495867').toString()
			//判断复选框是否被勾选 勾选则调用配置cookie方法 setcookie
			if (this.ruleForm.checked == true){		
				//传入账号名，密码，和保存天数3个参数
				this.setCookie(this.ruleForm.username,this.ruleForm.password,7)
			} else{
				//保存密码未勾选，清空Cookie
				this.clearCookie()
			}
			//登录接口post请求
			this.$http.post(process.env.VUE_APP_BASE_API_OA+'/userservice/user/login',
			{username:this.ruleForm.username,password:password,source:'oa',verify_type:'token'},
			{headers:{'Project-Id':'3'}}
			).then(function(res){	
				//code = 0 代表 登录成功
				if (res.body.code == 0) {
					this.$message.success('登录成功')			
					//登录成功后，在localStorage中存储token与uid，之后发送请求时，都需要在header中，加入此参数，以便服务器校验
					localStorage.setItem("token", res.body.data.token)
					localStorage.setItem("uid",res.body.data.userId)
					//nickname 真实姓名，用于系统中展示
					localStorage.setItem("nickname",res.body.data.nickname)		
					// 登录成功后正常跳转到用例管理界面
					window.location.href = "system.html#/upcase";
				} 
				// code =13 代表 用户名或密码错误
				else if(res.body.code == 13){
					this.$message.warning('用户名或密码错误')
				}					
			},
			//登录失败处理，弹出返回的错误提示
			function(res){
				this.$message.error('登录失败')
			});
		    } 
		  // 未通过表单输入验证，直接return false 不处理 验证未通过的提示显示在界面上
		  else {
		      return false;
			}
		});
		},
		//设置cookie，将cookie以一定的格式存取，保存的天数需要转换一下时间格式
		setCookie:function(username, password, exdays) {
		  var exdate = new Date(); //获取时间
		  exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) //保存的天数
		  //字符串拼接cookie
		  window.document.cookie = "username" + "=" + username + ";path=/;expires=" + exdate.toGMTString()
		  window.document.cookie = "password" + "=" + password + ";path=/;expires=" + exdate.toGMTString()
		},
		//读取cookie
		getCookie:function() {
		  if (document.cookie.length > 0) {
			  var arr = document.cookie.split('; ') //这里显示的格式需要切割一下自己可输出看下
			  for (var i = 0; i < arr.length; i++) {
				  var arr2 = arr[i].split('=') //再次切割		
				  //判断查找相对应的值
				  if (arr2[0] == 'username') {
					  this.ruleForm.username = arr2[1] //username写入到input输入框中
				  } else if (arr2[0] == 'password') {
					  this.ruleForm.password = arr2[1] //password写入到input输入框中
				  }
			  }
		  }
		},
		//清除cookie
		clearCookie:function() {
		  this.setCookie("", "", -1) //修改前两个参数值都为空，天数为-1天
		},
		//清空表单
		resetForm:function(formName) {
		this.ruleForm.checked = false //记住密码勾选框置为false
		  this.$refs[formName].resetFields() //input都清空
		}
	},
}
</script>

<style>
@import url('../../static/css/jacky.css')
</style>