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

//发送时get请求 params为js对象形式的参数 fn是响应成功是执行回调的函数 fail响应失败时执行回调的函数
function ajaxSendGet(url,params,async,succuss,fail){
	var xhr = createXhr();
	xhr.open(
		'get',
		url+'?'+concatParams(params),
		async
	);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			succuss(xhr.responseText);
		}else if(xhr.readyState == 4){
			fail(xhr.status+':'+xhr.statusText);
		}
	};
	xhr.send(null);
}

//拼接参数
function concatParams(params){
	var result = '';
	for(name in params){
		result += name+'='+params[name]+'&';
	}
	return result+'_='+Math.random();
}