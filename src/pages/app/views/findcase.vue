<template>
	<div id="findcase">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="用例名称">
				<el-input v-model="formInline.casename" placeholder="输入查询的用例名称"></el-input>
			</el-form-item>
			<el-form-item label="sdk版本号">
				<el-input v-model="formInline.sdkver" placeholder="输入查询的sdk版本号" style="width:170px;"></el-input>						    
			</el-form-item>
			<el-form-item label="设备号">
				<el-input v-model="formInline.did" placeholder="输入查询的设备号" style="width:340px;"></el-input>					
			</el-form-item>
			<el-form-item label="日期">
				<el-date-picker
				v-model="formInline.timevalue1"
				type="datetimerange"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:default-time="['12:00:00']"
				value-format="timestamp">
				</el-date-picker> 
			</el-form-item>
		    <el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="handleTableList()">搜索</el-button>
		    </el-form-item>
		</el-form>
		<el-divider></el-divider>
		<div class="cantainer">
			<el-table style="width:99.9%" :data="table.rows" stripe border
			:cell-style="cellStyle" :header-cell-style="rowClass">
				<el-table-column label="用例ID" prop="id" min-width="5%" align="center">
				</el-table-column>
				<el-table-column label="用例名称" prop="title" min-width="10%" align="center">    
				</el-table-column>
				<el-table-column label="用例状态" prop="case_status" :formatter="formatterstatus" min-width="10%" align="center">    
				</el-table-column>
				<el-table-column label="创建时间" prop="createtime" :formatter="formattertime" min-width="15%" align="center">    
				</el-table-column>
				<el-table-column label="sdk版本" prop="sdk_version" min-width="8%" align="center">    
				</el-table-column>
				<el-table-column label="设备号" prop="device_id" min-width="20%" align="center">
				</el-table-column>
				<el-table-column label="操作" prop="address" min-width="32%" align="center">
				  <template slot-scope="scope">
				    <el-button
						size="small"
				    type="success" 
				    icon="el-icon-caret-right" :loading="scope.row.btnloading"
						@click="handleAction(scope.$index, scope.row)">执行</el-button>
						<el-button
					  type="primary"
					  size="small"
					  icon="el-icon-edit"
					  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button
					  size="small"
					  type="danger"
					  icon="el-icon-delete"
					  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
						<el-button 
						type="info"
						size="small"
						icon="el-icon-document" v-if="scope.row.case_status == 1"
						@click="handleDetail(scope.$index, scope.row)">详情</el-button>
						<el-button
						type="warning"
						size="small"
						icon="el-icon-download" v-if="scope.row.case_status == 1"
						@click="handleDowload(scope.$index, scope.row)">下载</el-button>
				  </template>
				</el-table-column>
			</el-table>
			<!--size-change 为切换每页最大展示数触发的函数，current-change 为切换当前页数触发的函数-->
			<!--page-sizes为可提供的每页展示数选择-->
			<el-pagination
					@size-change="handleSizeChange" 
					@current-change="handleCurrentChange"
					:current-page="table.currentPage"
					:page-sizes="[5, 10, 20, 40]"
					:page-size="table.pagesize"      
					layout="total, sizes, prev, pager, next, jumper"
					:total="table.total">
			</el-pagination>
		</div>
		<el-dialog
		  title="更新用例"
		  :visible.sync="dialogupdate.Visible"
		  width="30%">
		  <el-form ref="dialogupdateform" :model="dialogupdate" label-width="100px">
			  <el-form-item label="用例名称">
			      <el-input v-model="dialogupdate.title"></el-input>
			  </el-form-item>
			  <el-form-item label="sdk版本号">
			      <el-input v-model="dialogupdate.sdk_version"></el-input>
			  </el-form-item>
			  <el-form-item label="设备ID">
			      <el-input v-model="dialogupdate.device_id"></el-input>
			  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogupdate.Visible = false">取 消</el-button>
		    <el-button type="primary" @click="updatecase()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="执行详情结果"
		  :visible.sync="dialogdetail.Visible"
		  width="50%">
		  <el-table style="width:99.9%" :data="dialogdetail.detailrows" stripe border
		  :cell-style="cellStyle" :header-cell-style="rowClass"
		  :span-method="cellMerge">
		  	<el-table-column type="index" label="ID" min-width="5%" align="center">
		  	</el-table-column>
		  	<el-table-column label="事件名" prop="event" min-width="10%" align="center">    
		  	</el-table-column>
		  	<el-table-column label="参数名称" prop="case_param"  min-width="10%" align="center">    
		  	</el-table-column>
		  	<el-table-column label="预期值" prop="param_value"  min-width="15%" align="center">    
		  	</el-table-column>
		  	<el-table-column label="实际值" prop="param_result" min-width="20%" align="center">    
		  	</el-table-column>
		  	<el-table-column label="结果" prop="result" min-width="8%" align="center">
				<template slot-scope="scope">
					<el-button v-if="scope.row.result == 'success'" size="small" type="success" icon="el-icon-check" circle></el-button>
					<el-button v-else type="danger" size="small" icon="el-icon-close" circle></el-button>
				</template>
		  	</el-table-column>
		  </el-table>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="dialogdetail.Visible=false">关 闭</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
import {formatDate,header}  from '../../../static/js/custom.js'
export default {
  name: 'findcase',
	data:function(){
		return{
			//搜索用例的四个查询条件
			formInline: {
			    casename: '',
			    sdkver: '',
			    did:'',
			    timevalue1:[],
			},
			/*
				用例展示表格数据绑定
				currentPage 当前页数
				pagesize 每页展示条数
				rows 表格内数据，由服务端返回
				total 用例总数，由服务端返回
			*/
			table:{
				currentPage : 1,
				pagesize : 10,
				rows : [],
				total: 0,
			},
			/*
			更新用例操作 模态框数据绑定
			*/
			dialogupdate:{
				Visible: false,
				title:'',
				sdk_version:'',
				device_id:'',
				id:'',
			},
			/*
				用例执行结果详情 模态框数据绑定
				定义spanArr与pos，用于表格event事件合并时使用
			*/
			dialogdetail:{
				Visible:false,
				detailrows:[],
				spanArr:[],
				pos:0
			},
		}
	},
	mounted() {
		//初始化执行获取表格数据的函数
		this.handleTableList()
	},
	methods:{
		/*
			table 单元格 style 特殊处理
			用例状态 0 即为未执行用例，将其文字显示为红色
			用例状态 1 即为已执行用例，将其文字显示为绿色
		*/
		cellStyle:function({row,column,rowIndex,columnIndex}){
			if (row.case_status === 0 && column.label == "用例状态"){
				return "color:red"
			} else if (column.label == "用例状态" && row.case_status === 1){
				return "color:green"
			}
		},
		//table header style 特殊处理
		rowClass:function({row,rowIndex}){
			// header()
			return header()
		},
		/*
			table 每页最大展示数切换时触发的函数
			将绑定的pagesize值根据选择进行赋值
		*/
		handleSizeChange:function(size){
			this.table.pagesize = size
			this.table.currentPage = 1 //切换pagesize的时候，一定要将当前页currentpage赋值为第一页,否则可能会出BUG
			this.handleTableList() //参数重新赋值后，用新的数据重新执行一次获取表格数据的请求
		},
		/*
			table 当前页数切换时触发的函数
			将绑定的currentpage值根据选择进行赋值
		*/
		handleCurrentChange: function(currentPage){
			this.table.currentPage = currentPage;
			this.handleTableList() //参数重新赋值后，用新的数据重新执行一次获取表格数据的请求
		},
		//获取表格信息,vue-resource 方式请求后端
		handleTableList:function(){
			//post请求
			var data = {
				pagesize : this.table.pagesize, //每页展示数
				pagenumber : this.table.currentPage, //当前页数
				title : this.formInline.casename, // 查询条件 - 用例名称
				sdk_version : this.formInline.sdkver, //查询条件 - sdk版本号
				device_id : this.formInline.did, //查询条件 - 设备ID
				starttime : this.formInline.timevalue1[0], //查询条件 开始时间
				endtime : this.formInline.timevalue1[1], //查询条件 结束时间
			}
			this.$http.post(process.env.VUE_APP_BASE_API+'/case/findcase',
			data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					//返回的数据是一个arr，arr中的每一个对象object都是一条数据，这里使用map函数，遍历数据中的每一个对象，并加入一个新的键btnloading, 值为false,用于后续切换loading状态
					this.table.rows = res.body.data.rows.map(item =>{
						item.btnloading = false
						return item
					})
					//获取用例总条数
					this.table.total = res.body.data.total
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
		//格式化用例状态 0 = 未执行，1 = 已执行
		formatterstatus:function(row,column){
			if (row.case_status == 0) {
				return '未执行'
			} else{
				return '已执行'
			}
		},
		//格式化用例创建时间，将时间戳转化为24小时制,函数为公共函数，定义在setting.js中
		formattertime:function(row,colunm){
			return formatDate(row.createtime)
		},
		//编辑用例操作，这里仅仅是将用例的一些数据绑定并传给dialog框中并绑定，更新的请求在下面
		handleEdit:function(index, row) {
			this.dialogupdate.Visible = true
			this.dialogupdate.title = row.title
			this.dialogupdate.sdk_version = row.sdk_version
			this.dialogupdate.device_id = row.device_id
			this.dialogupdate.id = row.id
			},
		//编辑用例更新请求
		updatecase:function(){
			//post请求
			var data = {
				id : this.dialogupdate.id,
				title : this.dialogupdate.title,
				sdk_version : this.dialogupdate.sdk_version,
				device_id : this.dialogupdate.device_id
			}
			this.$http.post(process.env.VUE_APP_BASE_API+'/case/updatecase',
			data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					this.$message.success('更新用例成功')
					//成功之后 记得 关闭dialog
					this.dialogupdate.Visible = false
					//获取数据更新表格
					this.handleTableList()
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
		//删除用例操作
		handleDelete:function(index, row) {
			this.$confirm('此操作将永久删除该用例, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				//删除用例请求
				this.$http.get(process.env.VUE_APP_BASE_API+'/case/delcase',
				{params:{id:row.id},
				headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
				).then(function(res){
					if (res.body.code == 0){
						this.$message.success('删除成功')
						//获取数据更新表格
						this.handleTableList()
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
		//执行用例操作
		handleAction:function(index,row){
			//点击执行用例后，按钮置位加载状态
			row.btnloading = true
			this.$message.info('用例正在执行中，请稍后')
			this.$http.get(process.env.VUE_APP_BASE_API+'/case/exccase',
			{params:{id:row.id},
			headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				//code = 0 代表 执行成功
				if (res.body.code == 0) {
					//执行完成后，loading状态关闭
					row.btnloading = false
					this.$message.success('执行成功')
					//重新获取表格数据
					this.handleTableList()
					}else if(res.body.code == 401){
						this.$alert('登录超时，请重新登录', '提示', {
							confirmButtonText: '确定',
							callback: action => {
							localStorage.clear()
							window.location.href = "./login.html"
							}
						})	
					}else{
						row.btnloading = false
						this.$message.error(res.body);
					}
			})
		},
		//下载用例操作，原生JS方法下载，带headers
		handleDowload:function(index,row){
			var xhr = new XMLHttpRequest();
			//GET请求,请求路径url,async(是否异步)
			xhr.open('GET', process.env.VUE_APP_BASE_API + '/case/downloadcase?id='+row.id, true);
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
						const filename = row.file;//
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
		//查看用例执行结果操作
		handleDetail:function(index,row){
			this.dialogdetail.Visible = true
			this.$http.get(process.env.VUE_APP_BASE_API+'/case/findcaselog',
			{params:{id:row.id},
			headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				//code = 0 代表 获取成功
				if (res.body.code == 0) {
					var temp_rows = []
					//因为data中返回的是一个对象，对象中包含数个数组，这里用一个循环将其合并到一个数组中，再赋值给table使用
					for(var i in res.body.data){
						// concat() 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本
						temp_rows = temp_rows.concat(res.body.data[i])
					}
					this.getSpanArr(temp_rows)
					this.dialogdetail.detailrows = temp_rows
				}
			})
		},
		/*
		这里是通过预处理，整理出需要合并的列的数据，以数组形式储存
		data就是我们从后台拿到的数据，通常是一个数组；spanArr是一个空的数组，用于存放每一行记录的合并数；pos是spanArr的索引。下面代码意思是：如果是第一条记录（索引为０），向数组中
		加入１，并设置索引位置；如果不是第一条记录，则判断它与前一条记录是否相等，如果相等，则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１，以此往复，得到所有行的合
		并数，０即表示该行不显示
		*/
		getSpanArr:function(data) {
			this.dialogdetail.spanArr = []
			this.dialogdetail.pos = 0
			for (var i = 0; i < data.length; i++) {
		    if (i === 0) {
					//第一行，数组加1，并设置索引开始的位置
	        this.dialogdetail.spanArr.push(1);
	        this.dialogdetail.pos = 0
		    } else {
				// 判断当前元素与上一个元素是否相同,这里我们合并的是事件名 event参数
					if (data[i].event === data[i - 1].event) {
						//元素相同，当前索引位置数字+1 ，并在数组中push一个0，代表这行的event不显示，与前面的合并
		        this.dialogdetail.spanArr[this.dialogdetail.pos] += 1;
		        this.dialogdetail.spanArr.push(0);
	        } else {
						//元素不相同，数组中push一个1，然后将索引位置pos定位到这个1 上
		        this.dialogdetail.spanArr.push(1);
		        this.dialogdetail.pos = i;
	        }
				}
			}
		},
		//根据得到的数组spanArr对表格进行合并渲染，并绑定合并方法，需要合并的列数据，从getSpanArr函数中即可获得
		cellMerge:function({ row, column, rowIndex, columnIndex }) {
					//合并的是第二列，所以columnIndex 为1 ，0代表第一列
		      if (columnIndex === 1) {
						//_row代表合并占据的行数，_col代表合并占据的列数
		        const _row = this.dialogdetail.spanArr[rowIndex];
						//1 代表此列参与合并，row 与 col都为0代表此行不显示
	          const _col = _row > 0 ? 1 : 0;
		        return {
	            rowspan: _row,
             	colspan: _col
		        }
	    		} else{			
			}				  
		},
	},
}
</script>