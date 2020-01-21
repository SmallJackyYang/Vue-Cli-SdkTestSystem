<template>
	<div id="redis">
		<el-form ref="form" :model="form" label-width="110px" label-position="left">
		  <el-form-item label="key" >
			<el-col :span="6">
				<el-input v-model="form.key" ></el-input>
			</el-col>
		  </el-form-item>
		  <el-form-item label="value">
			<el-col :span="6">
				<el-input 
				type="textarea"
				:rows="8" v-model="form.value" ></el-input>
			</el-col>
		  </el-form-item>
			<el-button style="margin-top: 25px;" @click="find">查询</el-button>
			<el-button style="margin-left: 10px;width: 82px;" @click="add">增加</el-button>
			<el-button style="margin-left: 10px;" @click="update">更新</el-button>
			<el-button style="margin-left: 10px;width: 82px;" @click="deleteredis">删除</el-button>
			<el-button style="margin-left: 10px;" type="warning" @click="reset">初始化</el-button>			
		</el-form>
	</div>
</template>

<script>
export default {
  name: 'redis',
	data:function(){
		return{
			form:{
				key:'',
				value:'',
			}
		}
	},
	methods:{
		add:function(){
			this.$http.get(process.env.VUE_APP_BASE_API+'/redis/addredis',
			{params:{key:this.form.key,value:this.form.value},
			headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					this.$message.success('增加成功')
					//删除后刷新数据
				}else if(res.body.code == 401){
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
		},
		update:function(){
			this.$http.get(process.env.VUE_APP_BASE_API+'/redis/updateredis',
			{params:{key:this.form.key,value:this.form.value},
			headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					this.$message.success('更新成功')
					//删除后刷新数据
				}else if(res.body.code == 401){
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
		},
		deleteredis:function(){
			this.$http.get(process.env.VUE_APP_BASE_API+'/redis/delredis',
			{params:{key:this.form.key},
			headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					this.$message.success('删除成功')
					//删除后刷新数据
				}else if(res.body.code == 401){
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
		},
		find:function(){
			this.$http.get(process.env.VUE_APP_BASE_API+'/redis/getredis',
			{params:{key:this.form.key},
			headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					this.$message.success('查询成功')
					this.form.value = res.body.data
				}else if(res.body.code == 401){
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
		},
		reset:function(){
			this.$http.get(process.env.VUE_APP_BASE_API+'/redis/fixredis',
			{params:{},
			headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					this.$message.success('初始化成功')
					//删除后刷新数据
				}else if(res.body.code == 401){
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
		},
	},
}
</script>