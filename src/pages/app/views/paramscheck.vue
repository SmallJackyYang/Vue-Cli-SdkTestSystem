<template>
	<div id="paramescheck">
		<el-row>
		  <el-col :span="4">
			  <div style="color: #409EFF;font-weight: bold;margin-top: 5px;">游戏选择
			    <el-select v-model="game.value" 
					placeholder="请选择游戏" 
					style="margin-top: 10px;width:100%;" 
					filterable
					size="small"
					@change="selectgamechange">
						<el-option
							v-for="item in game.options"
							:key="item.gamename"
							:label="item.gamename"
							:value="item.id+','+item.gamename">
							<span style="float: left">{{ item.gamename }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ formatte(item.channel)}}</span>
						</el-option>
			    </el-select>
			  </div>
			</el-col>
			<el-col :span="2" style="margin-left: 15px;">
				<div style="color: #409EFF;font-weight: bold;margin-top: 5px;">渠道选择
				  <el-select v-model="gameplat.value" 
					placeholder="请选择游戏渠道" 
					style="margin-top: 10px;width:100%;"
					filterable
					size="small">
						<el-option
							v-for="item in gameplat.options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
				  </el-select>
				</div>
		  </el-col>
			<el-col :span="17" style="margin-left: 15px;">
				<div v-if="eventscheck.events.length != 0" style="color: #409EFF;font-weight: bold;margin-top: 5px;">检查事件
					<el-checkbox style="margin-left: 20px;" :indeterminate="eventscheck.isIndeterminate" v-model="eventscheck.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
					<el-checkbox-group  v-model="eventscheck.checkedevents" @change="handleCheckedEventsChange" size="small">
						<el-checkbox-button border style="margin-top: 10px;" v-for="event in eventscheck.events" :label="event" :key="event.id" >{{event.event}}</el-checkbox-button>
					</el-checkbox-group>
				</div>
			</el-col>
		</el-row>
		<el-divider></el-divider>
		<el-row>
			<el-col :span="24">
				<div style="color: #409EFF;font-weight: bold;">SQL语句（配合上面的游戏字段，进行查询)
				<el-button type="primary" size="small" style="margin-left: 20px;" @click="dialogsave.Visible = true">
					<i class="el-icon-document-add"></i>  保存</el-button>
				<el-button type="primary" size="small" @click="sqlserchdetail"><i class="el-icon-document"></i>  我的查询</el-button>
				<el-checkbox v-model="sqlfind.checked" style="margin-left: 10px;">Limit 1000</el-checkbox>
				<el-button type="primary" size="small" style="float: right;width: 100px;margin-left: 10px;" @click="search(1,1)" :loading=sqlfind.loading>
					<i class="el-icon-search" ></i>  查询</el-button>
				<el-button type="warning" size="small" style="float: right;width: 100px;" @click="historysearch">
					<i class="el-icon-search" ></i>  历史查询</el-button>
				<el-button v-if="table.tabledata.length>0" type="primary" size="small" style="float: right;" @click="download">
					<i class="el-icon-download"></i>  一键导出</el-button>
					<textarea ref="mycode" class="codesql" v-model="sqlfind.sql" style="height:50px;width:99.9%;"></textarea>
			<!-- 		<el-input
						type="textarea"
						:rows="3"
						placeholder="请在此输入sql语句"
						v-model="sqlfind.sql" style="margin-top: 10px;">
					</el-input> -->
				</div>
			</el-col>
		</el-row>
		<el-divider></el-divider>
		<el-tabs v-model="activeName" type="border-card">
			<el-tab-pane label="SQL查询结果" name="first">
				<el-row>
					<el-table id="out-table" stripe border :data="table.tabledata"
					style="overflow-x: auto;width:99.9%"
					:max-height="500"
					:header-cell-style="HeaderCellStyle"
					:cell-style="cellStyle"
					v-loading="table.loading"
					element-loading-text="拼命加载中"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.5)">
						<template v-for="col in table.cols">
							<el-table-column :key="col" :prop="col" :label="col" :min-width="135" align="center"  show-overflow-tooltip></el-table-column>
						</template>
					</el-table>
					<!--size-change 为切换每页最大展示数触发的函数，current-change 为切换当前页数触发的函数-->
					<!--page-sizes为可提供的每页展示数选择-->
					<el-pagination
							@size-change="handleserverSizeChange" 
							@current-change="handleserverPageNumberChange"
							:current-page="table.pagenumber"
							:page-sizes="[30, 50, 100]"
							:page-size="table.pagesize"
							layout="total, sizes, prev, pager, next, jumper"
							:total="table.total">
					</el-pagination>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="数据结果统计" name="second">
				<el-row>
					<el-table id="out2-table" stripe border :data="counttable.tabledata"
					style="overflow-x: auto;width:100%"
					:max-height="500"
					:header-cell-style="HeaderCellStyle"
					v-loading="table.loading"
					element-loading-text="拼命加载中"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.5)">
						<el-table-column label="多发的事件" prop="extra" min-width="40%" align="center" >
						</el-table-column>
						<el-table-column label="少发的事件" prop="lack" min-width="60%" align="center" >
						</el-table-column>
					</el-table>
				</el-row>
			</el-tab-pane>
		</el-tabs>
		<el-dialog
		  title="保存用例"
		  :visible.sync="dialogsave.Visible"
		  width="25%">
		  <el-form ref="dialogsaveform" :model="dialogsave" label-width="80px">
			  <el-form-item label="文件名">
			      <el-input v-model="dialogsave.name"></el-input>
			  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogsave.Visible = false">取 消</el-button>
		    <el-button type="primary" @click="upsql">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="我的查询"
		  :visible.sync="dialogdetail.Visible"
		  width="35%"
		  >
		  <el-table style="width:99.9%" :data="dialogdetail.detailrows" stripe border
		  :header-cell-style="HeaderCellStyle">
		  	<el-table-column label="名称" prop="title" align="center" min-width="25%">
		  	</el-table-column>
		  	<el-table-column label="时间" prop="createtime" :formatter="formattertime" align="center" min-width="30%">    
		  	</el-table-column>
		  	<el-table-column label="操作" align="center" min-width="45%">
				<template slot-scope="scope">
					<el-button
					size="mini"
					type="primary" 
					icon="el-icon-folder-opened"
				@click="handleOpen(scope.$index, scope.row)">打开</el-button>
				<el-button
				size="mini"
				type="warning" 
				icon="el-icon-edit"
				@click="handleEdit(scope.$index, scope.row)"
				>编辑</el-button>
				<el-button 
				size="mini" 
				type="danger" 
				icon="el-icon-delete" 
				@click="handleDelete(scope.$index, scope.row)"
				>删除</el-button>
				</template>
		  	</el-table-column>
		  </el-table>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="dialogdetail.Visible=false">关 闭</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="重命名"
		  :visible.sync="dialogedit.Visible"
		  width="20%">
		  <el-form ref="dialogeditform" :model="dialogedit" label-width="80px">
			  <el-form-item label="名称">
			      <el-input v-model="dialogedit.name"></el-input>
			  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogedit.Visible = false">取 消</el-button>
		    <el-button type="primary" @click="rename">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="历史记录"
		  :visible.sync="dialoghistorylist.Visible"
		  width="45%">
			<el-table style="width:99.9%" 
			:data="dialoghistorylist.tabledata.slice((dialoghistorylist.currentPage - 1 )*dialoghistorylist.pageSize,dialoghistorylist.currentPage*dialoghistorylist.pageSize)" 
			stripe border
			:header-cell-style="HeaderCellStyle">
				<el-table-column label="SQL语句" prop="sqlstring" :formatter="formatsqlstring" align="center" min-width="60%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column label="查询时间" prop="updatetime"  :formatter="formattertime2" align="center" min-width="25%">    
				</el-table-column>
				<el-table-column label="操作" align="center" min-width="15%">
				<template slot-scope="scope">
					<el-button
					size="mini"
					type="primary" 
					icon="el-icon-folder-opened"
					@click="handleOpen(scope.$index, scope.row)">详情</el-button>
				</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="handleSizeChange" 
				@current-change="handleCurrentChange"
				:current-page="dialoghistorylist.currentPage"
				:page-sizes="[10, 20]"
				:page-size="dialoghistorylist.pageSize"      
				layout="total, sizes, prev, pager, next, jumper"
				:total="dialoghistorylist.tabledata.length">
			</el-pagination>
		</el-dialog>
	</div>
</template>

<script>
	import {formatDate,header,setString,getString}  from '../../../static/js/custom.js'
	
	//导入Base64加密
	let Base64 = require('js-base64').Base64
	
	//导入codemirror需要使用的文件
	import "codemirror/theme/ambiance.css"
	import "codemirror/lib/codemirror.css"
	import "codemirror/addon/hint/show-hint.css"
	let CodeMirror = require("codemirror/lib/codemirror")
	require("codemirror/addon/edit/matchbrackets")
	require("codemirror/addon/selection/active-line")
	require("codemirror/mode/sql/sql")
	require("codemirror/addon/hint/show-hint")
	require("codemirror/addon/hint/sql-hint")


export default {
  name: 'paramescheck',
	data:function(){
		return{
			/*
				游戏库游戏选择
				options 游戏选择框里数据，数据来源于服务器获取
				value 选择框选择之后获取的value值，绑定在select 组件上 这里的value ，格式为 '游戏id' + ',' + '游戏名字'
				selectgame 已选择的游戏名称，数据获取方式为value 中分离获得
				selectgameid 已选择的游戏id，数据获取方式为value 中分离获得
			*/
			game:{
				options: [],
				value: '',
				selectgame:'',
				selectgameid:'',
			},
			/*
				游戏平台选择
			*/
				gameplat:{
					options:[
						{
						  value: 0,
						  label: '安卓'
						}, {
						  value: 1,
						  label: 'iOS'
						}
					],
					value:0,
				},
			/*
				sql查询的参数
				database 查询的数据库名字
				sql sql查询的语句
				checked 用于确认是否勾选在查询语句末尾添加limit 1000
			*/
			sqlfind:{
				database:'',
				sql:'',
				checked:true,
				loading:false,
			},
			/*
				保存sql语句模态框 数据绑定
				name 保存语句的文件名称
			*/
			dialogsave:{
				Visible:false,
				name:'',
			},
			/*
				sql查询语句详情界面 模态框数据绑定
				detailrows table的数据，数据来源于服务端
			*/
			dialogdetail:{
				Visible:false,
				detailrows:[],
			},
			/*
				编辑sql查询语句 模态框数据绑定
				name 保存的新文件名称
				id sql语句的id 请求更新的时候使用
			*/
			dialogedit:{
				Visible:false,
				name:'',
				id:'',
			},
			/*
				sql查询结果的table
				cols table的header由此arr进行赋值，cols来源于服务端数据，自己提取
				tabledata table每行的数据，这个就不再多描述了
				tablecheckdata 服务端获取的，校验事件参数结果的返回，用于渲染table使用，标出缺少的字段 颜色展示
				loading 点击查询，给table置为 loading状态
				checkevents 字符串拼接显示的已勾选要检查的事件
				total 后端分页 存储数据总数
				pagesize  后端分页 一页的数据数
				pagenumber 后端分页 当前页数
				check 用于判断是查询还是翻页，1/查询，0/翻页，默认查询，执行翻页操作时再赋值修改
			*/
			table:{
				cols:[],
				tabledata:[],
				tablecheckdata:[],
				loading:false,
				checkevents:'',
				total:0,
				pagesize:30,
				pagenumber:1,
				check:1,
			},
			//用于获取数据统计结果的table
			counttable:{
				tabledata:[],
			},
			//标签页Tabs切换使用
			activeName:'first',
			/*
				游戏对应事件展示 多选checkbox
				checkAll 判断是否勾选全部
				checkedevents 已勾选的checkbox
				events 后端获取的游戏所有事件
				isIndeterminate 用于判断是否处于全选状态判断
			*/
			eventscheck:{
				checkAll:false,
				checkedevents:[],
				events:[],
				isIndeterminate:true,
			},
			/*
				sql 历史查询记录
				tabledata用于存储表格数据 
				currentPage 前端分页功能中的 当前页数
				pageSize 前端分页功能中的 一页最大条数
			*/
			dialoghistorylist:{
				Visible:false,
				tabledata:[],
				currentPage:1,
				pageSize: 10
			},
		}
	},
	mounted() {
		//通过校验，则发送请求获取游戏库里的数据
		this.getgamelist()
		
		/*
			涉及到使用sql语句查询，为增加体验，使用第三方库codemirror
			功能有 自动补全、输入提示、行号显示
			可替换主题（需要import对应的主体css文件，比如这里用的是ambiance）
		*/
		var that= this;
		let mime = 'text/x-mariadb' //代码输入框支持语言
		let theme = 'ambiance'//设置主题，不设置的会使用默认主题
		window.editor = CodeMirror.fromTextArea(this.$refs.mycode, {
			mode: mime,//选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
			indentWithTabs: true,
			smartIndent: true,
			lineNumbers: true,
			matchBrackets: true,
			lineWrapping: true,
			theme: theme,
			extraKeys: {'Ctrl': 'autocomplete'},//自定义快捷键
			hintOptions: {//自定义提示选项
				tables: {
					dana: ['platform_overseakr','event_mg','event_ios_mg'],
					usercenter: ['dana_usercenter'],
					did:[],
					ds:[],
					'format_datetime(from_unixtime(timestamp/1000),\'yyyy-MM-dd HH:mm:ss\')':[],
				},
			}
		})
		// 代码自动提示功能，记住使用inputRead事件不要使用change事件，这是一个坑，那样页面直接会卡死
		editor.on('inputRead', function () {
			editor.showHint()
		})
		// 每次代码编辑框的内容更新时，获取输入语句并赋值，这里要用that，不能使用this，具体原因可百度查询
		editor.on('update', function () {
			that.sqlfind.sql = editor.getValue()
		})
	},
	methods:{
		//获取所有的游戏
		getgamelist:function(){
			var data = {}
			this.$http.post(process.env.VUE_APP_BASE_API+'/game/findgame',
			data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					//获取到的数据，赋值，用于展示
				  this.game.options = res.body.data
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
		//格式化数据展示，因为拿到的值都是0 和 1，不能用于展示，因此多做一个处理
		formatte:function(channel){
			if(channel == 0){
				return '联运'
			}else if (channel == 1){
				return '自营'
			}
		},
		/*
			选择游戏后，触发展示对应游戏的检查字段详细表格，选择框每次切换都会执行一次这个函数
			将value值 通过substring方法进行提取 gamename与gameid，以便后续发送请求使用	
		*/
		selectgamechange:function(value){
			this.game.selectgame = value.substring(value.lastIndexOf(',')+1)
			this.game.selectgameid = value.substring(0,value.lastIndexOf(','))
			var data = {
				gameid:this.game.selectgameid
			}
			this.$http.post(process.env.VUE_APP_BASE_API+'/game/findgamefield',
			data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					//请求到数据后，将数据赋值给events里，进行展示，并赋值参数，使游戏的事件属于全选状态（默认）
					this.eventscheck.events = res.body.data
					this.eventscheck.checkedevents = this.eventscheck.events
					this.eventscheck.checkAll = true
					this.eventscheck.isIndeterminate = false;
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
		//检查字段!!!!!!
		search:function(pagenumber,check){
			if (this.sqlfind.sql.trim().length == 0 && this.table.check == 1){
			    this.$notify.error({
				  title: '错误',
				  message: '数据库名称orSQL语句不能为空，请重新输入',
				  duration: 2000,
				});
			}else{
				this.sqlfind.loading = true
				this.table.pagenumber = pagenumber
				this.table.loading = true
				this.table.checkevents = ''
				//发送前查询语句转换
				var sql_temp = setString(this.sqlfind.sql)
				//将已经勾选的游戏事件checkedevents里的数据拼接为字符串格式，中间用，隔开
				if (this.eventscheck.checkedevents.length != 0){
					for (var i = 0; i <this.eventscheck.checkedevents.length; i++){
						this.table.checkevents = this.table.checkevents + ',' + this.eventscheck.checkedevents[i].id.toString()
					}
					this.table.checkevents = this.table.checkevents.substr(1)
				}
				var data ={
					// db:'dana',
					//db 与sql 参数，需要使用base64编码后发送
					db:Base64.encode('dana'),
					sql:Base64.encode(sql_temp),
					eventid:this.table.checkevents,
					gameplat:this.gameplat.value,
					check:check,
					pagesize:this.table.pagesize,
					pagenum:pagenumber,
				}
				this.$http.post(process.env.VUE_APP_BASE_API+'/game/checkdata',
				data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
				).then(function(res){
					//查询完毕，不管结果如何，查询按钮的loading状态先去掉
					this.sqlfind.loading = false
					if (res.body.code == 0){
						//data为空，则不需要进行其余操作，清除上一次的数据后，提示即可
						if(res.body.data == null){
							this.table.loading = false
							this.table.tabledata = []
							this.table.cols = []
							this.counttable.tabledata = []
							this.$message.warning('未查询到对应的数据，请检查SQL语句是否正确or等待一段时间再查询')
						}else{
							//将table loading状态置为false，将渲染table的数据都赋值给对应的绑定参数,counttable因为使用push函数，因此每次查询的时候，先置为空
							this.table.loading = false
							// this.$message.success('查询成功')
							this.counttable.tabledata = []
							this.table.tablecheckdata = res.body.data.checkdata
							this.table.cols = res.body.data.tablekey.split(',')
							this.table.tabledata = res.body.data.danadata
							this.counttable.tabledata.push(res.body.data.extraevent)
							this.table.total = res.body.data.total
						}
					}else if(res.body.code == 401){
						this.table.loading = false
						this.$alert('登录超时，请重新登录', '提示', {
						  confirmButtonText: '确定',
						  callback: action => {
							localStorage.clear()
							window.location.href = "./login.html"
						  }
						})	
					}else{
						this.table.loading = false
						this.$message.error(res.body)
					}
				})
			}
		},
		//保存sql语句
		upsql:function(){
			if (this.dialogsave.name.trim().length == 0){
			    this.$message({
				  message: '文件名不能为空',
				  duration: 2000,
				  type:'error'
				});
			}else{
				//发送参数时依然先进行参数处理
				var sql_temp = setString(this.sqlfind.sql)
				var data = {
					title:this.dialogsave.name,
					// db:'dana',
					db:Base64.encode('dana'),
					sqlstring:Base64.encode(sql_temp),
				}
				this.$http.post(process.env.VUE_APP_BASE_API+'/dana/savesql',
				data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
				).then(function(res){
					if (res.body.code == 0){
					  this.$message.success('保存成功')
					  this.dialogsave.Visible = false
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
		//我的查询界面
		sqlserchdetail:function(){
			this.dialogdetail.Visible = true
			this.$http.get(process.env.VUE_APP_BASE_API+'/dana/findsql',
			{params:{},
			headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					this.dialogdetail.detailrows = res.body.data
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
		//格式化用例创建时间，将时间戳转化为24小时制
		formattertime:function(row,colunm){
			return formatDate(row.createtime)
		},
		formattertime2:function(row,colunm){
			return formatDate(row.updatetime)
		},
		//提交重命名
		rename:function(){
			if (this.dialogedit.name.trim().length == 0){
			    this.$message({
				  message: '名称不能为空',
				  duration: 1500,
				  type:'error',
				  showClose:true
				});
			}else{
				var data = {
					id:this.dialogedit.id,
					title:this.dialogedit.name
				}
				this.$http.post(process.env.VUE_APP_BASE_API+'/dana/updatesql',
				data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
				).then(function(res){
					if (res.body.code == 0){
					  this.$message.success('保存成功')
					  this.dialogedit.Visible = false
					  //更新后刷新数据
					  this.sqlserchdetail()
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
		/*
			table 单元格 style 特殊处理
			直接使用rowindex在tablecheckdata中以下标的方式进行判断，已达到循环的目的
			checkkey的值为一个字符串，字符串中逗号隔开每个为空的字段，那个字段就是我们需要进行处理渲染的字段
			当column.label在checkkey中包含时，则返回颜色pink
		*/
		cellStyle:function({row,column,rowIndex,columnIndex}){
			if( this.table.tablecheckdata != null){
				//nullkey为空就不需要处理了，直接略过
				if(this.table.tablecheckdata[rowIndex].nullkey != null && this.table.tablecheckdata[rowIndex].nullkey.checkkey != null){
					//indexof方法是返回该字符在字符串中第一次出现的位置，如果存在，则返回一个位置下标；该字符串中没有该字符，则会返回-1，因此这里用> -1 判断，即存在即可
					if(this.table.tablecheckdata[rowIndex].nullkey.checkkey[column.label]  == 1 ){
						return 'background:#F56C6C'
					}
				}
			}
		},
		//table header cell style 特殊处理
		HeaderCellStyle:function({row,rowIndex}){
			return header()
		},
		//点击显示出编辑的dialog框
		handleEdit:function(index,row){
			this.dialogedit.Visible = true
			this.dialogedit.id = row.id
			this.dialogedit.name = row.title
		},
		//打开sql语句操作
		handleOpen:function(index,row){
		
			// 后端返回的是 base64编码过的，因此需要先解码，后将url格式的&#39; 全部替换成单引号，函数都写在另一个公用JS里，直接调用
			this.sqlfind.sql = getString(Base64.decode(row.sqlstring))
			//解码完成后，要赋值到codemirror的输入框，需要使用它们的setvalue函数
			editor.setValue(this.sqlfind.sql)
			this.dialogdetail.Visible = false
			this.dialoghistorylist.Visible = false
		},
		//删除sql语句操作
		handleDelete:function(index,row){
			this.$confirm('此操作将永久删除该保存的sql语句, 是否继续?', '提示', {
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  type: 'warning'
			}).then(() => {
				//删除用例请求
				this.$http.get(process.env.VUE_APP_BASE_API+'/dana/delsql',
				{params:{id:row.id},
				headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
				).then(function(res){
					if (res.body.code == 0){
						this.$message.success('删除成功')
						//删除后刷新数据
						this.sqlserchdetail()
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
		//导出table为excel表格
		// exportExcel:function(){
		// 	 /* generate workbook object from table */
		// 	 var xlsxParam = {raw:true}  //转换成excel时，使用原始的格式
		// 	 var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'),xlsxParam)
		// 	 /* get binary string as output */
		// 	 var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array'})
		// 	 try {
		// 		 FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Results.xlsx')
		// 	 } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
		// 	 return wbout
		// },
		/*
			点击checkbox 全选按钮触发的函数
			用于切换checkbox 全选or全不选
			当val = true时候，则将events里的事件都传给已勾选的checkevents
			当val = false时候,则将checkevents置为空，代表全不选
			isIndeterminate 的目的是为了判断是否处于全选或全不选的状态，true代表没有全选or全不选，false代表此时为全选or全不选
		*/
		handleCheckAllChange:function(val){
			this.eventscheck.checkedevents = val ? this.eventscheck.events : [];
			this.eventscheck.isIndeterminate = false;
		},
		/*
			切换某个checkbox状态触发的函数
			首先获取此时已勾选的checkbox数量，若其与本身游戏包含的事件数量相同，则checkall 为 true状态，反之为false
			isIndeterminate 在 已勾选的checkbox数量>0 且 已勾选的checkbox数量 <本身游戏包含的事件数量 时，为true，代表此时不是全选or全不选
		*/
		handleCheckedEventsChange:function(value){
			let checkedCount = value.length;
			this.eventscheck.checkAll = checkedCount === this.eventscheck.events.length;
			this.eventscheck.isIndeterminate = checkedCount > 0 && checkedCount < this.eventscheck.events.length;
		},
		/*
			之前使用第三方依赖库xlsx，导致打包的时候对应的依赖库文件过大（和elementUI的差不多），大小为300多KB
			这里刚好后端那边做了导出处理，并且加上了对应的样式处理，与之前的下载文件不同的地方在于，这里需要将之前查询的data数据存下来
			在XMLHttpRequest请求里，在body中给后端传对应的数据即可
		*/
		download:function(){
			var xhr = new XMLHttpRequest();
			//Post请求,请求路径url,async(是否异步)
			xhr.open('POST', process.env.VUE_APP_BASE_API + '/game/export', true);
			//设置请求头参数的方式,如果没有可忽略此行代码
			xhr.setRequestHeader("token",localStorage.getItem("token"));
			xhr.setRequestHeader("uid",localStorage.getItem("uid"));
			xhr.setRequestHeader("Content-Type","application/json;charset=utf-8");
			//设置响应类型为 blob
			xhr.responseType = 'blob';
			//关键部分
			xhr.onload = function (e) {
				//如果请求执行成功
				if (this.status == 200) {
					const blob = this.response;
					const filename = "results.xlsx";//
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
		//查询历史记录
		historysearch:function(){
			this.dialoghistorylist.Visible = true
			var data = {}
			this.$http.post(process.env.VUE_APP_BASE_API+'/game/history',
			data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					this.dialoghistorylist.tabledata = res.body.data
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
		//初始化sql语句的显示
		formatsqlstring:function(row,colunm){	
			// 后端返回的是 base64编码过的，因此需要先解码，后将url格式的&#39; 全部替换成单引号
			return getString(Base64.decode(row.sqlstring))
		},
		//前端分页 每页数据数切换
		handleSizeChange:function(val){
			this.dialoghistorylist.currentPage = 1;
			this.dialoghistorylist.pageSize = val;
		},
		//前端分页 页数切换
		handleCurrentChange:function(val){
			this.dialoghistorylist.currentPage = val;
		},
		//后端分页 每页数据数切换
		handleserverSizeChange:function(val){
			this.table.pagenumber = 1
			this.table.pagesize = val
			this.table.check = 0
			this.search(this.table.pagenumber,this.table.check)
		},
		//后端分页 每页数据数切换
		handleserverPageNumberChange:function(val){
			this.table.pagenumber = val
			this.table.check = 0
			this.search(this.table.pagenumber,this.table.check)
		},
	},
}
</script>