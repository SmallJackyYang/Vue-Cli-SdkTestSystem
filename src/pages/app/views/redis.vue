<template>
	<div id="redis">
		<el-row>
			<div style="color: #409EFF;font-weight: bold;margin-top: 5px;">公共事件与字段修改
			  <el-button type="primary" size="small" style="float: right;" icon="el-icon-plus" @click="addeventdialog.Visible=true">新增公共事件</el-button>
			  <el-table style="width:99.9%;margin-top: 30px;overflow-x: auto;" 
				:data="table.data" stripe border
			  :header-cell-style="HeaderCellStyle" >
			  	<el-table-column label="公共事件名" prop="sdkkey" min-width="10%" align="center">
			  	</el-table-column>
			  	<el-table-column label="专属字段" prop="sdkvalue" min-width="78%" align="center">    
			  	</el-table-column>
			  	<el-table-column label="操作" prop="address" min-width="12%" align="center">
						<template slot-scope="scope">
							<el-button size="mini" type="warning" icon="el-icon-edit" @click="openediteventdialog(scope.$index, scope.row)">更新</el-button>
							<el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteevent(scope.$index, scope.row)">删除</el-button>
						</template>
			  	</el-table-column>
			  </el-table>
			</div>		
		</el-row>
		<el-dialog
		  title="新增公共事件"
		  :visible.sync="addeventdialog.Visible"
		  width="35%"
			:close-on-click-modal=false >
		  <el-form ref="addeventdialogform" :model="addeventdialog" label-width="80px">
			  <el-form-item label="事件名称">
					<el-input v-model="addeventdialog.sdkkey" style="width: 520px;" placeholder="输入事件名称" clearable></el-input>
			  </el-form-item>
			  <el-form-item label="字段参数">
					<el-input v-model="addeventdialog.sdkvalue" style="width: 520px;" placeholder="输入需要事件需要检查的字段" clearable></el-input>
			  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addeventdialog.Visible = false">取 消</el-button>
		    <el-button type="primary" @click="addevent">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="编辑公共事件"
		  :visible.sync="editeventdialog.Visible"
		  width="45%"
			:close-on-click-modal=false >
		  <el-form ref="editeventdialogform" :model="editeventdialog" label-width="80px">
			  <el-form-item label="事件名称">
					<el-input v-model="editeventdialog.sdkkey" style="width: 700px;" placeholder="输入事件名称" clearable></el-input>
			  </el-form-item>
				<el-form-item label="字段参数">
					<el-input v-model="editeventdialog.sdkvalue" style="width: 700px;" placeholder="输入需要事件需要检查的字段" clearable></el-input>
				</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editeventdialog.Visible = false">取 消</el-button>
		    <el-button type="primary" @click="updateevent">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
//只需要用到header 函数，就只导入一个header即可
import {header}  from '../../../static/js/custom.js'
export default {
  name: 'redis',
	data:function(){
		return{
			//table 表格展示后端请求回来的数据 绑定到data中
			table:{
				data:[],
			},
			/*
				添加公共事件模态框的数据绑定
				sdkkey为事件名称
				sdkvalue为事件的专属字段
			*/
			addeventdialog:{
				Visible:false,
				sdkkey:'',
				sdkvalue:'',
			},
			/*
				编辑公共事件模态框的数据绑定
				sdkkey为事件名称
				sdkvalue为事件的专属字段
			*/
			editeventdialog:{
				Visible:false,
				sdkkey:'',
				sdkvalue:'',
			},
		}
	},
	mounted() {
		//页面加载完成后，执行查询所有公共事件的函数
		this.find()
	},
	methods:{
		//table header cell style 特殊处理
		HeaderCellStyle:function({row,rowIndex}){
			return header()
		},
		//显示编辑事件专属字段的模态框，并赋对应的值到输入框中
		openediteventdialog:function(index,row){
			this.editeventdialog.Visible = true
			this.editeventdialog.sdkkey = row.sdkkey
			this.editeventdialog.sdkvalue = row.sdkvalue
		},
		//添加公共事件与其专属字段的函数
		addevent:function(){
			var data = {
				sdkkey : this.addeventdialog.sdkkey,
				sdkvalue : this.addeventdialog.sdkvalue,
			}
			this.$http.post(process.env.VUE_APP_BASE_API+'/key/addkey',
			data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					this.$message.success('添加成功')
					//添加成功后关闭模态框，并重新执行查询，以便更新表格
					this.addeventdialog.Visible = false
					this.find()
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
		//编辑公共事件与其专属字段的函数
		updateevent:function(){
			var data = {
				sdkkey : this.editeventdialog.sdkkey,
				sdkvalue : this.editeventdialog.sdkvalue,
			}
			this.$http.post(process.env.VUE_APP_BASE_API+'/key/updatekey',
			data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					this.$message.success('更新成功')
					//更新成功后关闭模态框，并重新执行查询，以便更新表格
					this.editeventdialog.Visible = false
					this.find()
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
		//删除公共事件
		deleteevent:function(index,row){
			this.$confirm('此操作将永久删除该事件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				var data = {
					sdkkey : row.sdkkey
				}
				this.$http.post(process.env.VUE_APP_BASE_API+'/key/delkey',
				data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
				).then(function(res){
					if (res.body.code == 0){
						this.$message.success('删除成功')
						this.find()
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
			}).catch(() => {
				return false
			});
		},
		//查询所有的公共事件，用于表格展示
		find:function(){
			var data = {}
			this.$http.post(process.env.VUE_APP_BASE_API+'/key/findkey',
			data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					//获取到的数据，赋值，用于展示
				  this.table.data = res.body.data
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