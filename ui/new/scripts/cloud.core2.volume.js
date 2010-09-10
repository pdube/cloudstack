function loadVolumeToRigntPanelFn($rightPanelContent) {   
    var jsonObj = $rightPanelContent.data("jsonObj");
    
    var $rightPanelContent = $("#right_panel_content");
    
    $rightPanelContent.find("#id").text(jsonObj.id);
    $rightPanelContent.find("#name").text(fromdb(jsonObj.name));    
    $rightPanelContent.find("#zonename").text(fromdb(jsonObj.zonename));    
    $rightPanelContent.find("#device_id").text(jsonObj.deviceid);   
    $rightPanelContent.find("#state").text(jsonObj.state);    
    $rightPanelContent.find("#storage").text(fromdb(jsonObj.storage));
    $rightPanelContent.find("#account").text(fromdb(jsonObj.account)); 
    
    $rightPanelContent.find("#type").text(jsonObj.type + " (" + jsonObj.storagetype + " storage)");
    $rightPanelContent.find("#size").text((jsonObj.size == "0") ? "" : convertBytes(jsonObj.size));		
    
    if (jsonObj.virtualmachineid == null) 
		$rightPanelContent.find("#vm_name").text("detached");
	else 
		$rightPanelContent.find("#vm_name").text(getVmName(jsonObj.vmname, jsonObj.vmdisplayname) + " (" + jsonObj.vmstate + ")");
		
    setDateField(jsonObj.created, $rightPanelContent.find("#created"));	
}


var volumeListAPIMap = {
    listAPI: "listVolumes",
    listAPIResponse: "listvolumesresponse",
    listAPIResponseObj: "volume"
};           
  
var volumeActionMap = {  
    "Detach Disk": {
        api: "detachVolume",            
        isAsyncJob: true,
        asyncJobResponse: "detachvolumeresponse",
        afterActionSeccessFn: function(){}
    },
    "Create Template": {
        isAsyncJob: true,
        asyncJobResponse: "createtemplateresponse",            
        dialogBeforeActionFn : doCreateTemplate,
        afterActionSeccessFn: function(){}   
    }  
}   



function doCreateTemplate($t, selectedItemIds, listAPIMap) {   
    //$("#dialog_create_template").find("#volume_name").text(volumeName);
	$("#dialog_create_template")
	.dialog('option', 'buttons', { 						
		"Create": function() { 
		    debugger;
		    var thisDialog = $(this);
									
			// validate values
	        var isValid = true;					
	        isValid &= validateString("Name", thisDialog.find("#create_template_name"), thisDialog.find("#create_template_name_errormsg"));
			isValid &= validateString("Display Text", thisDialog.find("#create_template_desc"), thisDialog.find("#create_template_desc_errormsg"));			
	        if (!isValid) return;		
	        
	        var name = trim(thisDialog.find("#create_template_name").val());
			var desc = trim(thisDialog.find("#create_template_desc").val());
			var osType = thisDialog.find("#create_template_os_type").val();					
			var isPublic = thisDialog.find("#create_template_public").val();
            var password = thisDialog.find("#create_template_password").val();				
			
			for(var id in selectedItemIds) {
			    var apiCommand = "command=createTemplate&volumeId="+id+"&name="+encodeURIComponent(name)+"&displayText="+encodeURIComponent(desc)+"&osTypeId="+osType+"&isPublic="+isPublic+"&passwordEnabled="+password;
			    doAction(id, $t, apiCommand, listAPIMap);	
			}		
		}, 
		"Cancel": function() { 
			$(this).dialog("close"); 
		} 
	}).dialog("open");
}         