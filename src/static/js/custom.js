// 时间戳格式化 24小时制,传入参数时间戳
function formatDate(time) {
   let date = new Date(parseInt(time));
   let Y = date.getFullYear() + '-';
   let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
   let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
   let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
   let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
   let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
   return Y + M + D + h + m + s;
}

//table header style 特殊处理
function header() {
	return "text-align:center;color:#606266;background:#eef1f6;font-size:15px"
}

//将单引号 ' 都替换为url格式编码，即&#39;以便之后base64编码使用；将from_unixtime转成#from_unixtime
function setString(sql){
	sql = sql.replace(/\'/g,"&#39;")
	if(sql.toLocaleLowerCase().indexOf("from_unixtime") != -1){
		sql = sql.replace(/from_unixtime/gi,"#from_unixtime")
	}
	if(sql.toLocaleLowerCase().indexOf("limit") == -1){
		sql += " limit 1000"
	}
	return sql
}

//将&#39转换成’ ，将#from_unixtime转成from_unixtime
function getString(sql){
	sql = sql.replace(/&#39;/g,"\'").replace(/#from_unixtime/gi,"from_unixtime")
	return sql
}

export{
	formatDate,
	header,
	setString,
	getString
}