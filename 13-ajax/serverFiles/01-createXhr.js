//创建ajax核心对象的方法
function createXhr(){
	if(typeof XMLHttpRequest != 'undefined'){
		return new XMLHttpRequest();
	}else if(typeof ActiveXObject != 'undefined'){
		var versions = ['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp'];
		for(var i = 0; i < versions.length; ++i){
			try{
				return new ActiveXObject(versions[i]);
			}catch(e){
				//处理异常 这里跳过
			}
		}
	}else{
		throw new Error('你的浏览器不支持ajax!');
	}
}