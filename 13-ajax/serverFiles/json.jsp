<%@page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
	response.setHeader("Access-Control-Allow-Origin", "*"); //允许跨域访问
	request.setCharacterEncoding("utf-8");
	out.print("{\"name\":\"李四\",\"age\":24}");
%>