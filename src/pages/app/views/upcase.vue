<template>
	<div id="upcase">
		<el-form ref="uploadform" :model="uploadform" :rules="rules" label-width="110px" label-position="left">
			<el-form-item label="用例名称" prop="casename">
			<el-col :span="11">
				<el-input v-model="uploadform.casename" style="width: 350px;"></el-input>
			</el-col>
			</el-form-item>
			<el-form-item label="SDK版本号" prop="sdkname">
			<el-col :span="11">
				<el-input v-model="uploadform.sdkname" style="width: 350px;"></el-input>
			</el-col>
			</el-form-item>
			<el-form-item label="设备ID" prop="didname">
			<el-col :span="11">
				<el-input v-model="uploadform.didname" style="width: 350px;"></el-input>
			</el-col>
			</el-form-item>
			<el-form-item label="Excel文件：" prop="datalist">
			<el-checkbox-group v-model="uploadform.datalist"></el-checkbox-group>
			<el-col :span="11">
				<el-upload
					class="upload-demo"
					ref="upload"
					accept=".xls"
					action=""
					:limit="1"
					:with-credentials="true"
					:file-list="uploadform.datalist"
					:auto-upload="false"
					:on-change="fileChange"
					:http-request="httpRequest"
					:on-remove="fileremove"
					:before-remove="beforeRemove">
					<el-button slot="trigger" size="small" type="info">上传文件<i class="el-icon-upload el-icon--right"></i></el-button>
					<span style="margin-top: 0px;font-size: 12px;color: red;margin-left: 10px;">只能上传xls格式的 excel文件,只能上传一个文件!!!</span>
					<br>
					<el-button type="primary" @click="submitUpload('uploadform')" style="margin-top: 25px;">用例提交</el-button>
					<el-button style="margin-left: 30px;width: 82px;" @click="resetForm('uploadform')">取消</el-button>
					<el-button style="margin-left: 30px;" type="warning" @click="download">下载上传用例模板</el-button>
				</el-upload>
			</el-col>
			</el-form-item>	
		</el-form>
	</div>
</template>

<script>
export default {
  name: 'upcase',
	data:function(){
		return{
			/*
				上传操作数据绑定
				datalist 上传文件，arr
				casename 用例名称
				sdkname  sdk版本号
				didname  设备ID
			*/
			uploadform:{
				datalist:[],
				casename:'',
				sdkname:'',
				didname:'',
			},
			//表单校验，包含输入与是否上传文件判断
			rules:{
				casename:[
					{required:true,message:'请输入用例名称',trigger:'blur' }
				],
				sdkname:[
					{required:true,message:'请输入sdk版本号',trigger:'blur'}
				],
				didname:[
					{required:true,message:'请输入设备ID（即did）',trigger:'blur'}
				],
				datalist:[
					{type: 'array', required: true, message: '请上传一个excel文件', trigger: 'change' }
				],
			}
		}
	},
	methods:{
		//移除已上传文件提示时触发的函数
		beforeRemove:function(file,fileList) {
			return this.$confirm(`确定移除 ${ file.name }？`);
		},
		//移除文件触发的钩子函数,返回的修改后的列表对象
		fileremove:function(file,fileList){
			this.uploadform.datalist = fileList			
		},
		// fileList 是文件列表发生变化后，返回的修改后的列表对象，这里直接赋值就好啦！
		fileChange:function(file, fileList) {
			this.uploadform.datalist = fileList
		},
		
		/*自定义的httpRequest请求
			因为这里上传控件使用的是手动上传操作，根据官网参数，手动上传必须定义一个自定义的http-request函数，函数带有参数param
			该函数由upload控件的submit()函数来触发
		*/
		httpRequest:function(param){
			//这里可以打印一下，看看传递的param参数是什么
			// console.log(param)
			let fileObj = param.file
			//带文件上传的请求需要用到 formdata格式，将参数一一append进去
			let formdata = new FormData()
			formdata.append('file',fileObj)
			formdata.append('title',this.uploadform.casename)
			formdata.append('device_id',this.uploadform.didname)
			formdata.append('sdk_version',this.uploadform.sdkname)			
			//post请求
			this.$http.post(process.env.VUE_APP_BASE_API+'/case/addcase',
			//因为默认的content-type是 json格式，带有文件的请求方式需要用form-data格式，加上参数emulateJSON:true即可
			formdata,{emulateJSON:true,headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					this.$message.success('用例上传成功');
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
		//通过输入条件验证后，用例上传请求触发（会调用上面的upload组件里自定义的httpRequest请求）,这里要注意的就是upload组件手动上传的触发的自定义http方式
		submitUpload:function(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
				this.$refs.upload.submit();
				}
				else{
					return false
				}
			})			
		},
		//清空表单
		resetForm:function(formName) {
			this.$refs[formName].resetFields()
		},
		//下载用例模板
		download:function(){
			var xhr = new XMLHttpRequest();
			//GET请求,请求路径url,async(是否异步)
			xhr.open('GET', process.env.VUE_APP_BASE_API + '/case/downloadcase?id=0', true);
			//设置请求头参数的方式,如果没有可忽略此行代码
			xhr.setRequestHeader("token",localStorage.getItem("token"));
			xhr.setRequestHeader("uid",localStorage.getItem("uid"));
			//设置响应类型为 blob
			xhr.responseType = 'blob';
			//关键部分
			xhr.onload = function (e) {
				//如果请求执行成功
				if (this.status == 200) {
					const blob = this.response;
					const filename = "用例上传模板.xls";//
					const link = document.createElement('a') // 创建a标签
					link.download = filename // a标签添加属性
					link.style.display = 'none'
					link.href = URL.createObjectURL(blob)
					document.body.appendChild(link)
					link.click() // 执行下载
					URL.revokeObjectURL(link.href) // 释放url
					document.body.removeChild(link) // 释放标签
				}
				else{
						alert('请求下载文件失败')
				}
			};
			//发送请求
			xhr.send();
		},
	},
}
</script>