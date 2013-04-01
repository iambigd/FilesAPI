/**
 * Html 5 multiple file download plugin
 * bigd 
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 **/

;(function($){
	
	$.multidownload = function(options){	
		
		var dllink,
		path;//include file name
		
		//event handler
		var downloadProgress,
			//downloadProgressAll,
			downloadDone,
			downloadFail;
		
		dllink = options.dllink;
		path = options.path;
		downloadProgress = options.progress;
//		downloadProgressAll = options.progressall;
		downloadDone = options.done;
		downloadFail = options.fail;
		
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
	
			xhr.open("GET", dllink, true);
			var mimetype = "application/octet-stream";
			xhr.overrideMimeType(mimetype);
			//xhr.responseType = "arraybuffer";
			xhr.responseType = "blob";
			xhr.onreadystatechange = function(){
		
				if (xhr.readyState == 4  && xhr.status == 200)
			    {
			    	window.storageInfo.requestQuota(window.TEMPORARY, 10*1024*1024, 
						function(grantedBytes) {
			    				  
						window.requestFileSystem(window.TEMPORARY,grantedBytes, function(fileSystem) {//fs: file system
								     
								    //save file to local
								    fileSystem.root.getFile(path, {create: true}, function(fileEntry) {
								     	
//								    	console.log("file: \"" + path + "\" created");
								    	
								    	//write file to local
								    	fileEntry.createWriter(function(fileWriter) {
									        fileWriter.onerror = function(e) {  
//									        	console.log("writer.onerror",e);
									        };
							
									        fileWriter.addEventListener("writeend", function() {
								                // navigate to file, will download
//								                console.log("writer.writeend");
								                
								                //download file from TEMPORARY into download folder of browser
								                var $downloadAnchor = $("<a></a>");
								                console.log($downloadAnchor);
								                $downloadAnchor.attr("id","dllink").attr("href",fileEntry.toURL());//set file system url
								                $downloadAnchor.attr("download",path);//set download file name
								                $downloadAnchor.hide();
								                $downloadAnchor.appendTo("body");
								               
								                if (document.getElementById('dllink').click){
								                	//simulate click action
								                	$downloadAnchor[0].click();
								                	//remove download linke
								                	$downloadAnchor.remove();

								                	if(typeof downloadDone === "function"){
								                		downloadDone();
								                	}
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
//				console.log("xhr.onprogress:",e);
				var progress = parseInt(e.loaded / e.total * 100, 10);
//				console.log("progress:" + progress);
				if(typeof downloadProgress === "function"){
					downloadProgress({
						loaded:e.loaded,
						total:e.total,
						percent:progress
					});
				}
			};
			
			xhr.send(null);
	};
	

	var onError = function(e){
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
	};
	
}(jQuery));