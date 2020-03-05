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
			  	<el-table-column label="专属字段" prop="sdkvalue" min-width="70%" align="center">    
			  	</el-table-column>
					<el-table-column label="平台" prop="plat" :formatter="formateplat" min-width="8%" align="center">
					</el-table-column>
			  	<el-table-column label="操作" prop="address" min-width="12%" align="center">
						<template slot-scope="scope">
							<el-button size="mini" type="warning" icon="el-icon-edit" @click="openediteventdialog(scope.$index, scope.row)">更新</el-button>
							<el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteevent(scope.$index, scope.row)" v-if="scope.row.sdkkey !='android_public'&&scope.row.sdkkey !='ios_public'">删除</el-button>
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
					<el-input v-model="addeventdialog.sdkkey" style="width: 100%;" placeholder="输入事件名称" clearable></el-input>
			  </el-form-item>
			  <el-form-item label="字段参数">
					<el-input v-model="addeventdialog.sdkvalue" style="width: 100%;" placeholder="输入需要事件需要检查的字段" clearable></el-input>
			  </el-form-item>
				<el-form-item label="平台">
				    <el-select v-model="addeventdialog.sdkplat" placeholder="请选择事件所属平台" style="width: 100%">
				        <el-option
				          v-for="item in addeventdialog.options"
				          :key="item.value"
				          :label="item.label"
				          :value="item.value">
				        </el-option>
				      </el-select>
				</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addeventdialog.Visible = false">取 消</el-button>
		    <el-button type="primary" @click="addevent(addeventdialog.sdkkey,addeventdialog.sdkvalue,addeventdialog.sdkplat)">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="编辑公共事件"
		  :visible.sync="editeventdialog.Visible"
		  width="35%"
			:close-on-click-modal=false >
		  <el-form ref="editeventdialogform" :model="editeventdialog" label-width="80px">
			  <el-form-item label="事件名称">
					<el-input v-model="editeventdialog.sdkkey" style="width: 100%;" placeholder="输入事件名称" :disabled="true"></el-input>
			  </el-form-item>
				<el-form-item label="字段参数">
					<el-input v-model="editeventdialog.sdkvalue" style="width: 100%;" placeholder="输入需要事件需要检查的字段" clearable></el-input>
				</el-form-item>
				<el-form-item label="平台" v-if="editeventdialog.sdkkey !='android_public'&&editeventdialog.sdkkey !='ios_public'">
				    <el-select  v-model="editeventdialog.sdkplat" placeholder="请选择事件所属平台" style="width: 100%">
				        <el-option
				          v-for="item in editeventdialog.options"
				          :key="item.value"
				          :label="item.label"
				          :value="item.value">
				        </el-option>
				      </el-select>
				</el-form-item>
				<el-form-item v-else label="平台">
				    <el-select  v-model="editeventdialog.sdkplat" placeholder="请选择事件所属平台" disabled style="width: 100%">
				        <el-option
				          v-for="item in editeventdialog.options"
				          :key="item.value"
				          :label="item.label"
				          :value="item.value">
				        </el-option>
				      </el-select>
				</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editeventdialog.Visible = false">取 消</el-button>
		    <el-button type="primary" @click="addevent(editeventdialog.sdkkey,editeventdialog.sdkvalue,editeventdialog.sdkplat)">确 定</el-button>
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
				sdkplat 为事件所属平台 默认双平台
			*/
			addeventdialog:{
				Visible:false,
				sdkkey:'',
				sdkvalue:'',
				sdkplat:2,
				options: [
					{
					  value: 0,
					  label: '安卓'
					},{
					  value: 1,
					  label: 'iOS'
					},{
					  value: 2,
					  label: '安卓&iOS'
					}
				],
			},
			/*
				编辑公共事件模态框的数据绑定
				sdkkey为事件名称
				sdkvalue为事件的专属字段
				sdkplat 为事件的所属平台 由传进来的值对应选择
			*/
			editeventdialog:{
				Visible:false,
				sdkkey:'',
				sdkvalue:'',
				sdkplat:'',
				options: [
					{
					  value: 0,
					  label: '安卓'
					},{
					  value: 1,
					  label: 'iOS'
					},{
					  value: 2,
					  label: '安卓&iOS'
					}
				],
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
			this.editeventdialog.sdkplat = row.plat
		},
		//添加公共事件与其专属字段的函数
		addevent:function(sdkkey,sdkvalue,sdkplat){
			if(sdkkey.trim().length == 0 ){
				this.$message({
				  message: '事件名不能为空',
				  duration: 2000,
				  type:'error'
				})
			}else{
				var data = {
					sdkkey : sdkkey,
					sdkvalue : sdkvalue,
					plat:sdkplat
				}
				this.$http.post(process.env.VUE_APP_BASE_API+'/key/addkey',
				data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
				).then(function(res){
					if (res.body.code == 0){
						this.$message.success('成功')
						//添加成功后关闭模态框，并重新执行查询，以便更新表格
						this.addeventdialog.Visible = false
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
			}
		},
		//删除公共事件
		deleteevent:function(index,row){
			this.$confirm('此操作将永久删除该事件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				var data = {
					sdkkey : row.sdkkey,
					sdkvalue : row.sdkvalue
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
		//平台名字格式化
		formateplat:function(row,column){
			if(row.plat == 0){
				return '安卓'
			}else if(row.plat == 1){
				return 'iOS'
			}else{
				return '安卓&iOS'
			}
		},
	},
}
</script>