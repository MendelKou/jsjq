//创建一个表示命名空间的对象 将方法绑在此对象上
var MyAjaxTools = {};

//创建ajax核心对象的方法
MyAjaxTools.createXhr = function createXhr(){
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

MyAjaxTools.ajax = function(args){
	MyAjaxTools.checkArgs(args);
	if(args.type.toLowerCase() == 'get'){
		MyAjaxTools.get(args);
	}else if(args.type.toLowerCase() == 'post'){
		MyAjaxTools.post(args);
	}
};

//通用回调函数
MyAjaxTools.callback = function(xhr,dataType,success,error){
	if(xhr.readyState == 4 && xhr.status == 200){
		if(success){
			if(dataType.toLowerCase() == 'text'){
				success(xhr.responseText);
			}else if(dataType.toLowerCase() == 'xml'){
				success(xhr.responseXML);
			}
		}
	}else if(xhr.readyState == 4){
		if(error){
			error(xhr.status+':'+xhr.statusText);
		}
	}
};

//处理get请求
MyAjaxTools.get = function(args){
	var xhr = MyAjaxTools.createXhr();
	xhr.open(
		'get',
		MyAjaxTools.get.concatData(args.url,args.data),
		args.async
	);
	xhr.onreadystatechange = function(){
		MyAjaxTools.callback(xhr,args.dataType,args.success,args.error);
	};
	xhr.send(null);
};

//拼接get请求的参数
MyAjaxTools.get.concatData = function(url,data){
	if(url.indexOf('?') == -1){
		url += '?';
	}
	for(var name in data){
		url += name+'='+data[name]+'&';
	}
	if(url[url.length-1] === '?'){ //参数为空
		url = url.substring(0,url.length-1);
	}else{ //参数不为空 
		url += '_='+Math.random(); //伪类防止缓存 加上随机参数
	}
	return url;
};

//发送post请求 
MyAjaxTools.post = function (args){
	var xhr = MyAjaxTools.createXhr();
	xhr.open('post',args.url,args.async);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.onreadystatechange = function(){
		MyAjaxTools.callback(xhr,args.dataType,args.success,args.error);
	};
	xhr.send(MyAjaxTools.post.concatData(args.data));
};

//拼接post请求参数
MyAjaxTools.post.concatData = function(data){
	var result = '';
	for(var name in data){
		result += name+'='+data[name]+'&';
	}
	if(result){
		result = result.substring(0,result.length-1);
	}
	return result;
};

//参数检查
MyAjaxTools.checkArgs = function(args){
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
	if(typeof args.dataType !='string' || 
		(args.dataType.toLowerCase() != 'text' && args.dataType.toLowerCase() != 'xml')){
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


/*
	jQuery的ajax使用起来很方便 我们也希望封装一个类型的工具方法
	jQuery中的ajax的使用形式如下:
		$.ajax(
			{
				url:'请求地址',
				type:'请求类型',
				async:'是否异步',
				data:'数据',
				dataType:'返回的数据类型',
				success:成功是回调的函数,
				error:失败是回调的函数
			}
		);
*/
/*var obj = {name:'aa'};
	var obj2 = {};
	console.log(obj.name);
	console.log(obj.age); //undefined
	console.log(obj2.age); //undefined */