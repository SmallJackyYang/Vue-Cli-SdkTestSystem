<template>
	<div id="gamesetting">
		<el-row>
		  <el-col :span="6">
			  <div style="color: #409EFF;font-weight: bold;margin-top: 0px;">游戏库
					<el-button type="primary" size="small" style="float: right;margin-bottom: 5px;" icon="el-icon-plus" @click="addgamedialog.Visible=true">新增游戏</el-button>
			    <el-select v-model="game.value" 
					placeholder="请选择游戏" 
					style="margin-top: 10px;width:100%;" 
					filterable
					@change="selectgamechange">
						<el-option
							v-for="item in game.options"
							:key="item.gamename"
							:label="item.gamename"
							:value="item.id+','+item.gamename">
							<span style="float: left">{{ item.gamename }}</span>
							<el-button type="danger" size="mini" style="float: right;" icon="el-icon-delete" round @click='deletegame(item.id)'></el-button>
							<el-button type="primary" size="mini" style="float: right;" icon="el-icon-edit" round @click='openupdategamedialog(item.id,item.gamename,item.channel)'></el-button>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ formatte(item.channel)}}</span>
						</el-option>
			    </el-select>
			  </div>
			</el-col>
		</el-row>
		<el-divider></el-divider>
		<el-row>
			<div v-if="this.game.value" style="color: #409EFF;font-weight: bold;margin-top: 5px;">游戏字段检查配置
				<el-button type="danger" style="margin-left: 10px;" size="small" icon="el-icon-delete" @click="multipledelteevent(gametable.selectedevent)">批量删除</el-button>
			  <el-button type="primary" size="small" style="float: right;" icon="el-icon-plus" @click="addeventdialog.Visible=true">新增事件</el-button>
			  <el-table style="width:99.9%;margin-top: 30px;overflow-x: auto;" 
				:data="gametable.tabledata" stripe border
			  :header-cell-style="HeaderCellStyle" 
				@selection-change="handleSelectionChange">
					<el-table-column type="selection" min-width="2%" align="center">
					</el-table-column>
			  	<el-table-column label="事件名" prop="event" min-width="15%" align="center">
			  	</el-table-column>
			  	<el-table-column label="参数字段" prop="field" min-width="65%" :formatter="formatteparam" align="center">    
			  	</el-table-column>
			  	<el-table-column label="操作" prop="address" min-width="18%" align="center">
						<template slot-scope="scope">
							<el-button size="mini" type="warning" icon="el-icon-edit" @click="openediteventdialog(scope.$index, scope.row)">更新</el-button>
							<el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteevent(scope.$index, scope.row)">删除</el-button>
						</template>
			  	</el-table-column>
			  </el-table>
			</div>		
		</el-row>
		<el-dialog
		  title="新增游戏"
		  :visible.sync="addgamedialog.Visible"
		  width="25%">
		  <el-form ref="addgamedialogform" :model="addgamedialog" label-width="80px">
			  <el-form-item label="游戏名称">
					<el-input v-model="addgamedialog.gamename" placeholder="输入游戏名称" clearable></el-input>
			  </el-form-item>
			  <el-form-item label="运营渠道">
					<el-select v-model="addgamedialog.gamechannel" placeholder="请选择运营渠道" style="width: 100%;">
							<el-option
								v-for="item in addgamedialog.options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
					</el-select>
			  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addgamedialog.Visible = false">取 消</el-button>
		    <el-button type="primary" @click="addgame">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="编辑游戏"
		  :visible.sync="updategamedialog.Visible"
		  width="25%">
		  <el-form ref="updategamedialogform" :model="updategamedialog" label-width="80px">
			  <el-form-item label="游戏名称">
			      <el-input v-model="updategamedialog.gamename" placeholder="输入游戏名称" clearable></el-input>
			  </el-form-item>
			  <el-form-item label="运营渠道">
			      <el-select v-model="updategamedialog.gamechannel" placeholder="请选择运营渠道" style="width: 100%;">
			          <el-option
			            v-for="item in updategamedialog.options"
			            :key="item.value"
			            :label="item.label"
			            :value="item.value">
			          </el-option>
			        </el-select>
			  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="updategamedialog.Visible = false">取 消</el-button>
		    <el-button type="primary" @click="updategame">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="新增事件"
		  :visible.sync="addeventdialog.Visible"
		  width="35%"
			:close-on-click-modal=false >
		  <el-form ref="addeventdialogform" :model="addeventdialog" label-width="80px">
				<el-form-item label="游戏：">
					<el-input v-model="game.selectgame" :disabled="true"></el-input>
				</el-form-item>
			  <el-form-item label="事件名">
					<el-input v-model="addeventdialog.event" placeholder="输入事件名称" clearable></el-input>
			  </el-form-item>
			  <el-form-item label="字段参数">
					<el-input v-model="addeventdialog.field" placeholder="输入字段参数" clearable></el-input>
			  </el-form-item>
		  </el-form>
			<el-tag style="margin-left: 80px;" type="danger" effect="dark">参数之间用逗号隔开;字段参数填写格式:field1,field2,;公共字段不需要填写,只需自定义字段</el-tag>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addeventdialog.Visible = false">取 消</el-button>
		    <el-button type="primary" @click="addevent">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="编辑事件字段"
		  :visible.sync="editeventdialog.Visible"
		  width="35%"
			:close-on-click-modal=false >
		  <el-form ref="editeventdialogform" :model="editeventdialog" label-width="80px">
				<el-form-item label="游戏：">
					<el-input v-model="game.selectgame" :disabled="true"></el-input>
				</el-form-item>
			  <el-form-item label="事件名">
					<el-input v-model="editeventdialog.event" placeholder="输入事件名称" clearable></el-input>
			  </el-form-item>
			  <el-form-item label="字段参数">
					<el-input v-model="editeventdialog.field" placeholder="输入字段参数" clearable></el-input>
			  </el-form-item>
		  </el-form>
			<el-tag style="margin-left: 80px;" type="danger" effect="dark">参数之间用逗号隔开;字段参数填写格式:field1,field2,;公共字段不需要填写,只需自定义字段</el-tag>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editeventdialog.Visible = false">取 消</el-button>
		    <el-button type="primary" @click="editevent">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
import {formatDate,header}  from '../../../static/js/custom.js'
export default {
  name: 'gamesetting',
	data:function(){
		return{
			/*
				添加游戏 模态框数据绑定
				gamename 游戏名称
				gamechanel 渠道 0 联运，1 自营，这里给一个默认值 0
				options 选择框 选择项
			*/
			addgamedialog:{
				Visible:false,
				gamename:'',
				gamechannel:0,
				options: [
					{
					  value: 0,
					  label: '联运'
					}, {
					  value: 1,
					  label: '自营'
					}
				],
			},
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
				编辑游戏 模态框 数据绑定
				gamename 游戏名称
				gamechannel 渠道
				gameid 游戏id
			*/
			updategamedialog:{
				Visible:false,
				gamename:'',
				gamechannel:'',
				gameid:'',
				options: [
					{
					  value: 0,
					  label: '联运'
					}, {
					  value: 1,
					  label: '自营'
					}
				],
			},
			/*
				游戏事件对应的event表格
				tabledata 表格数据，来源于服务器数据
				multipleSelection table的多选操作，用于选择需要操作的游戏事件
				selectedevent 已多选的游戏事件，只是将上面的multipleSelection里的数据，由arr转为字符串，以便进行请求时发送
			*/
			gametable:{
				tabledata:[],
				multipleSelection: [],
				selectedevent:'',
			},
			/*
				添加事件 模态框 数据绑定
				event 添加的游戏事件名称
				filed 添加的游戏事件 需要校验的字段参数
			*/
			addeventdialog:{
				Visible:false,
				event:'',
				field:'',
			},
			/*
				编辑事件模态框
				event 编辑的游戏事件名称
				field 编辑的游戏事件 需要校验的字段参数
				eventid 编辑的游戏事件对应的id
			*/
			editeventdialog:{
				Visible: false,
				eventid:'',
				event:'',
				field:'',
			},
		}
	},
	mounted() {
		//通过校验，则发送请求获取游戏库里的数据
		this.getgamelist()
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
		//新增游戏
		addgame:function(){
			//添加游戏 名称与渠道不能为空
			if(this.addgamedialog.gamename.trim().length == 0 || this.addgamedialog.gamechannel.toString().trim().length == 0){
				this.$message({
				  message: '游戏名称与渠道不能为空',
				  duration: 2000,
				  type:'error'
				})
			}else{
				var data = {
					gamename: this.addgamedialog.gamename,
					channel: this.addgamedialog.gamechannel,
				}
				this.$http.post(process.env.VUE_APP_BASE_API+'/game/addgame',
				data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
				).then(function(res){
					if (res.body.code == 0){
					  this.addgamedialog.Visible = false
						this.$message.success('添加成功')
					  this.addgamedialog.gamename = ''
						//添加成功后刷新游戏库内容
					  this.getgamelist()
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
		//格式化数据展示，因为拿到的值都是0 和 1，不能用于展示，因此多做一个处理
		formatte:function(channel){
			if(channel == 0){
				return '联运'
			}else if (channel == 1){
				return '自营'
			}
		},
		//删除游戏
		deletegame:function(id){
			this.$confirm('此操作将删除该游戏, 是否继续?', '提示', {
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  type: 'warning'
			}).then(() => {
				//删除游戏请求
				var data = {
					id: id
				}
				this.$http.post(process.env.VUE_APP_BASE_API+'/game/delgame',
				data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
				).then(function(res){
					if (res.body.code == 0){
						this.$message.success('删除成功')
						//删除游戏成功后，将选择的游戏值清空，并刷新游戏库内容
					  this.game.value = ''
					  this.getgamelist()
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
		//打开更新游戏模态框 并将游戏对应的值赋值进去
		openupdategamedialog:function(id,gamename,channel){
			this.updategamedialog.Visible = true
			this.updategamedialog.gamename = gamename
			this.updategamedialog.gamechannel = channel
			this.updategamedialog.gameid = id
		},
		//更新游戏
		updategame:function(){
			//输入的游戏名称与渠道不能为空
			if(this.updategamedialog.gamename.trim().length == 0 || this.updategamedialog.gamechannel.toString().trim().length == 0){
				this.$message({
				  message: '游戏名称与渠道不能为空',
				  duration: 2000,
				  type:'error'
				})
			}else{
			var data = {
				id:this.updategamedialog.gameid,
				channel:this.updategamedialog.gamechannel,
				gamename:this.updategamedialog.gamename,
			}
			this.$http.post(process.env.VUE_APP_BASE_API+'/game/updategame',
			data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					this.$message.success('更新成功')
				  this.updategamedialog.Visible =false
					//更新游戏成功后，将选择的游戏值清空，并刷新游戏库内容
				  this.game.value = ''
				  this.getgamelist()
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
					this.gametable.tabledata = res.body.data
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
		//添加游戏事件请求
		addevent:function(){
			var data = {
				gameid:this.game.selectgameid,
				event:this.addeventdialog.event,
				field:this.addeventdialog.field,
			}
			this.$http.post(process.env.VUE_APP_BASE_API+'/game/addgamefield',
			data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					this.addeventdialog.Visible = false
					this.addeventdialog.event = ''
					this.addeventdialog.field = ''
					//添加完成后刷新一下数据，因为选择的游戏没变，因此传之前记录的参数过去
					this.selectgamechange(this.game.value)
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
		//删除游戏事件
		deleteevent:function(index,row){
			this.$confirm('此操作将删除该事件, 是否继续?', '提示', {
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  type: 'warning'
			}).then(() => {
				//删除游戏请求
				var data = {
					eventid:row.id
				}
				this.$http.post(process.env.VUE_APP_BASE_API+'/game/delgamefield',
				data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
				).then(function(res){
					if (res.body.code == 0){
						this.$message.success('删除成功')
						//删除完成后刷新一下数据，因为选择的游戏没变，因此传之前记录的参数过去
						this.selectgamechange(this.game.value)
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
		//打开编辑事件字段窗口，并赋值
		openediteventdialog:function(index,row){
			this.editeventdialog.Visible = true
			this.editeventdialog.eventid = row.id
			this.editeventdialog.event = row.event
			this.editeventdialog.field = row.field
		},
		//编辑字段参数接口请求
		editevent:function(){
			var data = {
				id:this.editeventdialog.eventid,
				event:this.editeventdialog.event,
				field:this.editeventdialog.field,
			}
			this.$http.post(process.env.VUE_APP_BASE_API+'/game/updategamefield',
			data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
			).then(function(res){
				if (res.body.code == 0){
					this.$message.success('更新成功')
					this.editeventdialog.Visible = false
					//编辑完成后刷新一下数据，因为选择的游戏没变，因此传之前记录的参数过去
					this.selectgamechange(this.game.value)
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
		//选择项变更触发的函数
		handleSelectionChange:function(val){
			this.gametable.multipleSelection = val
			this.gametable.selectedevent = ''
			//将arr multipleSelection里的数据转换成 字符串，后续发送请求时使用，每个数据用，隔开，最后去除第一位的，即可
			if (this.gametable.multipleSelection.length != 0){
				for (var i = 0; i <this.gametable.multipleSelection.length; i++){
					this.gametable.selectedevent = this.gametable.selectedevent + ',' + this.gametable.multipleSelection[i].id.toString()
				}
				this.gametable.selectedevent = this.gametable.selectedevent.substr(1)
			}
		},
		//table header cell style 特殊处理
		HeaderCellStyle:function({row,rowIndex}){
			return header()
		},
		//批量删除游戏event
		multipledelteevent:function(eventid){
			if(eventid == ''){
				this.$notify.error({
				  title: '提示',
				  message: '未勾选任何游戏事件',
				  duration: 2000,
				});
			}else{
				this.$confirm('此操作将批量删除所选事件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//删除游戏请求
					var data = {
						eventid:eventid
					}
					this.$http.post(process.env.VUE_APP_BASE_API+'/game/delgamefield',
					data,{headers:{'uid':localStorage.getItem("uid"),'token':localStorage.getItem("token")}}
					).then(function(res){
						if (res.body.code == 0){
							this.$message.success('批量删除成功')
							//删除完成后刷新一下数据，因为选择的游戏没变，因此传之前记录的参数过去
							this.selectgamechange(this.game.value)
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
			}
		},
		//事件 字段参数显示格式化，如果field里的值为null，显示为‘空’，有值则显示正常值
		formatteparam:function(row,column){
			if(row.field == 'null'){
				return '空'
			}
			else{
				return row.field
			}
		},
	},
}
</script>