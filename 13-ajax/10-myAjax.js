/*
 * 封装一个ajax函数 用法类似jQuery的$.ajax
 * 使用说明:
 * ajax({
 * 	url:'请求地址', //必须
 * 	type:'请求类型', //必须 不区分大小写 如post,POST相同
 *  async:true, //可选 true/false 是否为异步 默认为true即异步
 *  data:{"键":值}, //可选 提交的数据
 *  dataType:'返回的数据类型', //可选 text/xml/json 不区分大小写 默认为text 返回数据为json时 请引入json2文件
 *  beforeSend:发送请求前的回调函数, //可选
 *  success:请求成功时的回调函数, //可选 通常都有
 *  error:请求失败时的回调函数 //可选
 * });
 */
function ajax(args){
	//参数检查
	checkArgs(args);
	//创建ajax核心对象
	var xhr = createXhr();
	//如果为get请求则处理url
	if(args.type === 'get'){
		args.url = handleGetUrl(args.url,args.data);
	}
	xhr.open(args.type,args.url,args.async);
	//如果为post方式则设置必要的请求头content-type
	if(args.type === 'post'){
		xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
	}
	//绑定事件处理函数
	xhr.onreadystatechange = function(){
		if(xhr.readyState===4 && xhr.status===200){
			if(args.hasOwnProperty('success')){
				if(args.dataType === 'text'){
					args.success(xhr.responseText);
				}else if(args.dataType === 'xml'){
					args.success(xhr.responseXML);
				}else if(args.dataType === 'json'){
					if(typeof JSON === 'object'){
						console.log('使用了JSON.parse');
						args.success(JSON.parse(xhr.responseText));
					}else{
						args.success(eval('('+xhr.responseText+')'));
					}
				}
			}
		}else if(xhr.readyState===4){
			if(args.hasOwnProperty('error')){
				args.error(xhr.status);
			}
		}
	};
	if(args.hasOwnProperty('beforeSend')){
		args.beforeSend();
	}
	if(args.type === 'get'){
		xhr.send(null);
	}else if(args.type === 'post'){
		xhr.send(concatParams(args.data));
	}
	
	//参数检查函数
	function checkArgs(args){
		//整体参数类型检查
		if(!args || args.constructor !== Object){
			throw TypeError('错误的参数类型');
		}
		//必要的参数存在性检查
		if(!args.hasOwnProperty('url')){
			throw Error('缺少必要的url参数');
		}
		if(!args.hasOwnProperty('type')){
			throw Error('缺少必要的type参数');
		}
		//参数类型检查
		if(typeof args.url !== 'string'){
			throw TypeError('参数url类型错误');
		}
		if(typeof args.type !== 'string'){
			throw TypeError('参数type类型错误');
		}
		//值的合法性检查
		if(args.url.replace(/^\s+|\s+$/,'') === ''){
			throw Error('参数url的值不能为空');
		}
		//统一为小写
		args.type = args.type.toLowerCase();
		if(args.type !== 'get' && args.type !== 'post'){
			throw Error('参数type的值不合法');
		}
		if(args.hasOwnProperty('async') && 
				args.async !==true && args.async !==false){
			throw Error('参数async的值不合法');
		}
		if(args.hasOwnProperty('data') && (args.data == null || args.data.constructor !== Object)){
			throw Error('参数data的值不合法');
		}
		if(args.hasOwnProperty('dataType') && (typeof args.dataType !== 'string' || 
				(args.dataType.toLowerCase() != 'text' && 
					args.dataType.toLowerCase() != 'xml' &&
					args.dataType.toLowerCase() != 'json'))){
			throw Error('参数dataType的值不合法');
		}
		if(args.hasOwnProperty('beforeSend') && typeof args.beforeSend !== 'function'){
			throw Error('参数beforeSend的值不合法');
		}
		if(args.hasOwnProperty('success') && typeof args.success !== 'function'){
			throw Error('参数success的值不合法');
		}
		if(args.hasOwnProperty('error') && typeof args.error !== 'function'){
			throw Error('参数error的值不合法');
		}
		
		//默认参数值
		if(!args.hasOwnProperty('async')){
			args.async = true;
		}
		if(!args.hasOwnProperty('dataType')){
			args.dataType = 'text';
		}else{
			args.dataType = args.dataType.toLowerCase();//统一为小写
		}
	}
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
				}
			}
		}
		throw new Error('你的浏览器不支持ajax!');
	}
	//处理get方式的url及请求参数
	function handleGetUrl(url,params){
		//如果最后一个字符不是? 则加上?
		if(url.indexOf('?') !== url.length-1){
			url += '?';
		}
		//拼接参数
		var paramsStr = concatParams(params);
		if(paramsStr !== ''){
			paramsStr += '&';
		}
		paramsStr += '_='+new Date().getTime();
		url += paramsStr;
		return encodeURI(url);
	}
	//拼接参数
	function concatParams(params){
		var paramsStr = '';
		for(var key in params){
			paramsStr += key+'='+params[key]+'&';
		}
		if(paramsStr !== ''){
			//去掉最后的&
			paramsStr = paramsStr.substring(0,paramsStr.length-1);
		}
		return paramsStr;
	}
}