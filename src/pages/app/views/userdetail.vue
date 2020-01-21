<template>
	<div id="userdetail">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span style="color: #409EFF;font-weight: bold;">个人详情</span>
			</div>
			<div class="text item">
				{{'用户名称： ' + this.userdetail.username }}
			</div>
			<div class="text item">
				{{'真实姓名： ' + this.userdetail.nickname }}
			</div>
			<div class="text item">
				{{'创建时间： ' + this.userdetail.createtime }}
			</div>
			<div class="text item">
				用户状态：
				<el-tag v-if="this.userdetail.status== true" type="success">正常</el-tag>
				<el-tag v-else type="danger">异常</el-tag>
			</div>
			<div class="text item">
				{{'邮箱地址： ' + this.userdetail.email }}
			</div>
		</el-card>
	</div>
</template>

<script>
import {formatDate,header}  from '../../../static/js/custom.js'
export default {
  name: 'userdetail',
	data:function(){
		return{
			userdetail:{
				username:'',
				nickname:'',
				status:'',
				createtime:'',
				email:'',
			},
		}
	},
	mounted() {
		//处于已登录状态，则初始化执行请求，获取个人数据
		this.getuserdetail()
	},
	methods:{
		//获取用户信息
		getuserdetail:function(){
			this.$http.get(process.env.VUE_APP_BASE_API_OA+'/userservice/userinfo/detail',
			{params:{userId:localStorage.getItem("uid"),projectId:3},
			headers:{'Project-Id':'3','User-id':localStorage.getItem("uid"),'Kdc-token':localStorage.getItem("token"),'Kdc-Refresh-Token':0}}
			).then(function(res){
				if (res.body.code == 0) {
					//获取到数据后，赋值到对应的绑定上
					this.userdetail.username = res.body.data.username
					this.userdetail.nickname = res.body.data.nickname
					this.userdetail.status = res.body.data.status
					this.userdetail.email = res.body.data.email
					this.userdetail.createtime = formatDate(res.body.data.createdAt)
				}
				else if(res.body.code == 211){
					this.$alert('登录超时，请重新登录', '提示', {
					  confirmButtonText: '确定',
					  callback: action => {
						localStorage.clear()
						window.location.href = "./login.html"
					  }
					})	
				}else{
					this.$message.error(res.body);
				}
			})
		}
	},
}
</script>