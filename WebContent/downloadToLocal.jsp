<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Download file</title>
<script type="text/javascript" src="js/plugins/jquery.core.1.8.2.js"></script>
<script type="text/javascript" src="js/plugins/jquery.multidownload.js"></script>
<script type="text/javascript" src="js/downloadtolocal.js"></script>
</head>
<body>
<input type="text" id="url" value="http://localhost:8080/FilesAPI/download/bigd.jpg" style="width:200px;"/>
<input type="button" id="download" value="Download files with file API" />
</body>
</html>