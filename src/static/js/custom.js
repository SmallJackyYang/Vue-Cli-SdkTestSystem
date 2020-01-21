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

export{
	formatDate,
	header
}