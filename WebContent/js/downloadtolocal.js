$(function(){	
	
	$("#download").click(function(){
		console.log("Download me...");
		//downloadFile($("#url").val(),"download.jpg");
		
		$.multidownload({		
			dllink: $("#url").val(),
			path:"download.jpg",
			progress:function(data){
				console.log(data);
			},
			done:function(){
				
			},
			fail:function(){
				
			}
		});
		
	});
	
});

function downloadFile(dllink,path){
	
	//Note: The file system has been prefixed as of Google Chrome 12:	
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	window.storageInfo = window.storageInfo || window.webkitStorageInfo;
	window.URL = window.URL || window.webkitURL;
	
	window.storageInfo.queryUsageAndQuota(window.TEMPORARY, 
			function(usage, quota) {
			  console.log("Using: " + (usage / quota) * 100 + "% of temporary storage");
			}, function(e) {
			  console.log("Error", e);
		});
		
		var xhr = new XMLHttpRequest();
	
		var fileURL = dllink;
		
		xhr.open("GET", fileURL, true);
		//xhr.overrideMimeType("image/jpeg");
		
		//var mimetype = "image/jpeg";
		var mimetype = "application/octet-stream";
		xhr.overrideMimeType(mimetype);
		//xhr.responseType = "arraybuffer";
		xhr.responseType = "blob";
		xhr.onreadystatechange = function(){
			
			console.log("xhr.onreadystatechange event handler");
			
			if (xhr.readyState == 4  && xhr.status == 200)
		    {
		    	window.storageInfo.requestQuota(window.TEMPORARY, 10*1024*1024, 
					function(grantedBytes) {
		    				
		    		  console.log("requestQuota event handler");
		    		  console.log("grantedBytes:" + grantedBytes);
		    		  
						window.requestFileSystem(window.TEMPORARY,grantedBytes, function(fileSystem) {//fs: file system
							  
							    console.log("requestFileSystem event handler");
							    
							    //save file to local
							    fileSystem.root.getFile(path, {create: true}, function(fileEntry) {
							     	
							    	console.log("file: \"" + path + "\" created");
							    	
							    	//test ok
//							    	var img = document.createElement("img");
//									img.src = fileEntry.toURL(); 
//									document.body.appendChild(img);

							    	//write file to local
							    	fileEntry.createWriter(function(fileWriter) {
					
//							    		fileWriter.onwrite = function(e) {  
//								        	console.log("writer.onwrite",e);
//								        };
								        
								        fileWriter.onerror = function(e) {  
								        	console.log("writer.onerror",e);
								        };
						
								        fileWriter.addEventListener("writeend", function() {
							                // navigate to file, will download
							                console.log("writer.writeend");
							                
							                //download file from TEMPORARY into download folder
							                var $downloadAnchor = $("<a></a>");
							                console.log($downloadAnchor);
							                $downloadAnchor.attr("id","dllink").attr("href",fileEntry.toURL());//set file system url
							                $downloadAnchor.attr("download",path);//set download file name
							                $downloadAnchor.hide();
							                $downloadAnchor.appendTo("body");
							               
							                if (document.getElementById('dllink').click){
							                	
//							                	document.getElementById('dllink').click();	
							                	$downloadAnchor[0].click();
							                	$downloadAnchor.remove();
							                }
							                		
							            }, false);
								        
								        var blob = new Blob([xhr.response],{type:mimetype});
								        
								        fileWriter.write(blob);
								        
								       
							      	}, onError);
							    	
							    }, onError);
						    
						  }, onError);
					  
						}, 
					onError);//end of request quota
		    	
		    }
		};
		
		xhr.onprogress = function(e){
			console.log("xhr.onprogress:",e);
			/*
			bubbles: false
			cancelBubble: false
			cancelable: true
			clipboardData: undefined
			currentTarget: XMLHttpRequest
			defaultPrevented: false
			eventPhase: 0
			lengthComputable: true
			loaded: 53754
			position: 53754
			returnValue: true
			srcElement: XMLHttpRequest
			target: XMLHttpRequest
			timeStamp: 1362451091945
			total: 53754
			totalSize: 53754
			type: "progress"
			*/
			var progress = parseInt(e.loaded / e.total * 100, 10);
			console.log("progress:" + progress);
		};
		
		xhr.send(null);

}

function onError(e) {
	  var msg = "";

	  switch (e.code) {
	    case FileError.QUOTA_EXCEEDED_ERR:
	      msg = "QUOTA_EXCEEDED_ERR";
	      break;
	    case FileError.NOT_FOUND_ERR:
	      msg = "NOT_FOUND_ERR";
	      break;
	    case FileError.SECURITY_ERR:
	      msg = "SECURITY_ERR";
	      break;
	    case FileError.INVALID_MODIFICATION_ERR:
	      msg = "INVALID_MODIFICATION_ERR";
	      break;
	    case FileError.INVALID_STATE_ERR:
	      msg = "INVALID_STATE_ERR";
	      break;
	    default:
	      msg = "Unknown Error";
	      break;
	  };

	  console.log("Error: " + msg);
}