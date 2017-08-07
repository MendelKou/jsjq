<%@page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
	response.setHeader("Access-Control-Allow-Origin", "*"); //允许跨域访问
	request.setCharacterEncoding("utf-8");
	String name = request.getParameter("name");
	String age = request.getParameter("age");
	out.print("Hello "+age+"岁的"+name+",现在是："+new Date());
%>