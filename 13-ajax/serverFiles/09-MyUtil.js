//创建一个表示命名空间的对象 将方法绑在此对象上
var MyUtil = {};

//创建ajax核心对象的方法
MyUtil.createXhr = function(){
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
};

//ajax发送请求的通用方法
/*参数说明
	{
		url:'请求地址',
		type:'请求类型',
		async:'是否异步',
		data:'数据',
		dataType:'返回的数据类型',
		success:成功时回调的函数,
		error:失败时回调的函数
	}
*/

MyUtil.ajax = function(args){
	MyUtil.ajax.checkArgs(args);
	var xhr = MyUtil.createXhr();
	var data = concatData(args.data);
	if(args.type == 'get'){
		if(args.url.lastIndexOf('?') != args.url.length -1){
			args.url += '?';
		}
		args.url += data + (data == '' ? '' : '&') + '_='+Math.random();
	}
	xhr.open(args.type,args.url,args.async);
	if(args.type == 'post'){
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	}
	if(args.async){
		xhr.onreadystatechange = callback;
	}
	if(data == '' || args.type == 'get'){
		xhr.send(null);
	}else if(args.type == 'post'){
		xhr.send(data);
	}
	if(!args.async){
		callback();
	}

	//拼接参数
	function concatData(data){
		if(typeof data == 'undefined'){
			return '';
		}
		var result = '';
		for(var name in data){
			result += name+'='+data[name]+'&';
		}
		if(result){
			result = result.substring(0,result.length-1); //去掉最后的&
		}
		return result;
	}

	//通用回调函数
	function callback(){
		if(xhr.readyState == 4 && xhr.status == 200){
			if(args.success){
				if(args.dataType == 'text'){
					args.success(xhr.responseText);
				}else if(args.dataType == 'xml'){
					args.success(xhr.responseXML);
				}else if(args.dataType == 'json'){
					args.success(JSON.parse(xhr.responseText));
				}
			}
		}else if(xhr.readyState == 4){
			if(args.error){
				args.error(xhr.status+':'+xhr.statusText);
			}
		}
	}
};

//ajax参数检查
MyUtil.ajax.checkArgs = function(args){
	if(typeof args.url == 'undefined'){
		throw new Error('缺少参数url');
	}
	if(typeof args.type == 'undefined'){
		throw new Error('缺少参数type');
	}
	if(typeof args.async == 'undefined'){
		throw new Error('缺少参数async');
	}
	if(typeof args.dataType == 'undefined'){
		throw new Error('缺少参数dataType');
	}

	if(typeof args.url != 'string' || args.url.replace(/(^\s+)|(\s+$)/g,'') == ''){
		throw new Error('不合法的url');
	}
	if(typeof args.type !='string' || (args.type.toLowerCase() != 'post' && args.type.toLowerCase() != 'get')){
		throw new Error('不合法的type');
	}
	if(typeof args.data !=  'undefined' && typeof args.data != 'object'){
		throw new Error('不合法的data');
	}
	if(typeof args.dataType !='string' || (args.dataType != 'text' && args.dataType != 'xml' 
		&& args.dataType != 'json')){
		throw new Error('不合法的dataType');
	}
	if(typeof args.async != 'boolean'){
		throw new Error('不合法的async');
	}
	if(typeof args.success !=  'undefined' && typeof args.success != 'function'){
		throw new Error('不合法的success回调函数');
	}
	if(typeof args.error != 'undefined' && typeof args.error != 'function'){
		throw new Error('不合法的error回调函数');
	}
};