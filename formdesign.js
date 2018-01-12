//var ModuleVersion="Form Designer Version PROJECT_VERSION";
	var dataSet = {'designs':[]};
	var filteredDataSet = {'designs':[]};
	var viewDataSet = {'designs':[]};
	var entryPerPage = {'designs':10};;
	var currentPage = {'designs':1};;
	var totalPages = {'designs':1};
	var daoInfosIcon = {'Connection':'/images/connection-icon.png',
			'Driver':'/images/driver-icon.png',
			'Clone Settings':'/images/settings-icon.png',
			'Object Modifier Settings':'/images/settings-icon.png',
			'Driver Design':'/images/design-icon.png',
			'Form Design':'/images/design-icon.png',
			'Mail Design':'/images/design-icon.png',
			};
	var optionsToShow = [{optionName:"ObjectID", isShow:false},
		{optionName:"ID", isShow:false},
		{optionName:"Name", isShow: true},
		{optionName:"Timestamp", isShow:true},
		{optionName:"Version", isShow:true},
		{optionName:"SourceID", isShow:false}];
	var selected = 0;
	var defid = "";   
	var show = 0;
	
	$(document).ready(function() {
		appendScriptsSync({ src: "highlight/highlight.pack.js"});
		$("#moduleversion").append(ModuleVersion);
		$("#save-design").prop({'disabled':true, "title":"Please fill 'Workflow Form name'-field"});
		$( "#formsort" ).sortable({
			revert: true
		});
		updateTable();
    	
       // Create the Edit button
       $('#tabs-1').on('click', 'a.command_edit', function (e) {
	        e.preventDefault();
	        var id = e.currentTarget.dataset.target;
	 		var objid = e.currentTarget.dataset.objectid;
	 		if (id) {
	 			//oTabs.tabs("option" , "active" ,1);
	 			$('#tabs a[href="#tabs-2"]').tab('show');
            	selected=id;
            	defid=objid;
            	         	
            	$.get( 
					"FormDesign/" + selected +"?tmpid="+UUID.create() , 
		 			function(data) {
						var jd = $.parseJSON(data);
						$("#formsort").empty();
		 	    		$('#defname').val(jd.name);	
		 	    		$('#defname').trigger("change");
		 	    		$("#addons").prop("checked", false);
			 	   		ShowHideAddons();
			 	   		$("#preview").prop("checked", false);
			 	   		Preview();
		 	    		$("#formsort").append(jd.design);
		 	    		$(".addedit .delicon").show();
		  			}  
				);
	            
	         }
   	 	} );
       // Create the Show button
       $('#tabs-1').on('click', 'a.command-show', function (e) {
	        e.preventDefault();
	        var id = e.currentTarget.dataset.target;
	 		var objid = e.currentTarget.dataset.objectid;
	 		if (id) {
	 			$('.view-menu').toggleClass("disabled disabled-div", false);
	 			$('#tabs a[href="#tabs-3"]').tab('show');
            	show=id;
            	updateDisplayType(show, "#displaytype", "#viewer");
	            
	         }
   	 	} );
         
	    // Create the Delete Button to delete a record (without asking a user for confirmation)
	    $('#tabs-1').on('click', 'a.command-remove', function (e) {
	        e.preventDefault();
	        var id = e.currentTarget.dataset.target;
	 		var objid = e.currentTarget.dataset.objectid;
	 		var conf = confirm("Are you shure you want to delete this Item / Version ?");
	 		if (conf) {
		 		if (id) {
		 			$.ajax({
		   				type: "DELETE",
		    			url: "FormDesign/" + id	    	
					});  
					updateTable();
				}
	 		}
	    } );  
	    
	    // Create the Export button
	       $('#tabs-1').on('click', 'a.command-export', function (e) {
		        e.preventDefault();
		        var id = e.currentTarget.dataset.target;
		 		var objid = e.currentTarget.dataset.objectid;
		 		if (id) {
		 			$.ajax({
		   				type: "GET",
		    			url: "Export/" + id +"?tmpid="+UUID.create()
					});  
		         }
	   	 	} );
		    // Create the Clone Button to clone a record
		    $('#tabs-1').on('click', 'a.command-topmost', function (e) {
		        e.preventDefault();
		        var id = e.currentTarget.dataset.target;
		 		var objid = e.currentTarget.dataset.objectid;
		 		if (id) {
		 			$.ajax({
		   				type: "GET",
		    			url: "CloneObject/" + id	    	
					});  
					updateTable();
				}
		    } );   
		       	
	    
	    // Sync Hide STFU (for IE of course)
	    ShowHideAddons();
	    preventClicks();
	   
	    $('#displaytype').change(function() {updateDisplayType(show, "#displaytype", "#viewer");});
	    $("#add-design").on('click', addDesign);
	    $("#designs-filter").on('keyup', function(){filterEntry("designs",2,true); return false;});
	    $("#designs-paginator").on("change", function(){paginatorOnChange("designs"); return false;});
	    	
	    	$(".tab-content").on('click',"a.tox-page", function(e){
	    		e.preventDefault();
	    		var target = e.target.dataset.target;
	    	currentPage[target] = Number(e.target.dataset.page);
	        selectPage(target);
	    		return false;});
	    	
	    	$(".tab-content").on('click',"a.tox-next", function(e){
	    		e.preventDefault();
	    		var target = e.currentTarget.dataset.target;
	    		if(currentPage[target] != totalPages[target]) currentPage[target] += 1;
	        if(target) selectPage(target);
	    	});
	    	
	    	$(".tab-content").on('click',"a.tox-prev", function(e){
	    		e.preventDefault();
	    		var target = e.currentTarget.dataset.target;
	    		if (currentPage[target] != 1) currentPage[target] -= 1;
	    		if(target) selectPage(target);
	    	});
	    	
	    	$("#defname").on('change input paste keyup', function() { 
	        	$('#defname').parent().toggleClass('has-error', false);
	        	if ($('#defname').val().length){ 
	        		$("#save-design").prop({'disabled':false, "title":""});
	        	} else {
	        		$("#save-design").prop({'disabled':true, "title":"Please fill 'Workflow Form name'-field"});
	        	}
	        });
	});
	
	function addDesign(){
		resetFormDesign();
		$('#tabs a[href="#tabs-2"]').tab('show');
	}
	
	function closeTabs(){
		resetFormDesign();
		$('#tabs a[href="#tabs-1"]').tab('show');
	}

	function updateTable() {
		$("#designs-filter").val("");
		clearConnectionEntry('designs');		
		
		// Wait 0,5 Seconds, before reload data... Multithreading Rocks, but sometimes we are too fast :D
		window.setTimeout(function() {getDesigns()}, 500)
	}	

	
	function resetFormDesign() {
		$("#formsort").empty();
		$("#defname").val("");
		$("#defname").trigger("change");
		$("#addons").prop("checked", false);
		ShowHideAddons();
		$("#preview").prop("checked", false);
		Preview();
		defid="";
		selected=0;
	}   
	
	function saveFormDesign() {
		$(".delicon").hide();
		$('input').each(function(){
		        $(this).attr('value',$(this).val());
		});
		var postdata = {
				name: $('#defname').val(),
				data: { 
					design: $("#formsort").html(),
					name: $('#defname').val()
				},
				objectid: defid
		}
		$.ajax({
	   			type: "PUT",
	    		url: "FormDesign",
	    		contentType: "application/;charset=UTF-8",
	    		data: JSON.stringify(postdata)
		}); 
		
		// goto Tab 1
		$('#tabs a[href="#tabs-1"]').tab('show');
		// Cycle the Editor
		// Set Object to new
		defid="";
		selected=0;
		// Update the Table
		updateTable();
		resetFormDesign();
		$("#properties modal-body").empty();
	}    

	
	
	function ShowHideAddons() {
		if ($("#addons").is(':checked')) {
			$(".addon").show();
		} else {
			$(".addon").hide();
		}
	}
	function Preview() {
		if ($("#preview").is(':checked')) {
			$(".addedit .delicon").hide();
			$("#elements").hide();
			//$("#properties").hide();
			$(".tox-buttons").hide();
			$(".infoicon").hide();
			//$("div[aria-describedby='properties']").hide();
			$("#forms").css({'background-color':"#acacac"});
			$(".design-form li").css({"background-color":"#acacac","color":"black"});
		} else {
			$(".addedit .delicon").show();
			$("#elements").show();
			//$("#properties").show();
			$(".tox-buttons").show();
			$(".infoicon").show();
			//$("div[aria-describedby='properties']").show();
			$("#forms").css({'background-color':"white"});
			$(".design-form li").css({"background-color":"#3f6f82","color":"white"});
		}
	}

	function Numbers() {
		if ($("#numbers").is(':checked')) {
			$('#formsort').removeClass("nonumber").addClass("number");
		} else {
			$('#formsort').addClass("nonumber").removeClass("number");
		}
	}
	function preventClicks() {
		$(".infoicon").click( function(e) { e.stopPropagation(); e.preventDefault(); return false; } );
		$(".delicon").click( function(e) { e.stopPropagation(); e.preventDefault(); return false; } );
	}
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
	
	function clone(obj) {
		var target = [];
	    for (var i in obj) {
	    	if (obj[i]) {
	          target.push(obj[i]);
	        }
	    }
	    return target;
	}
	function getDesigns(){
		$.ajax({
			type: "GET",
			url: "getTable/12",
			success: function(data){
				console.log(data);
				var jData;
				try{
					jData = JSON.parse(data);
				} catch(e){
					jData = data;
				}
				if (jData.iTotalRecords > 0){
					dataSet['designs'] = jData.aaData;
					filteredDataSet['designs'] = clone(dataSet['designs']);
					viewDataSet['designs'] = clone(dataSet['designs']);
					initPaginator(dataSet['designs'],'designs');
					createConnectionEntry(paginator(dataSet['designs'],'designs'), 'designs');
				} else {
					dataSet['designs'] = [];
					filteredDataSet['designs'] = clone(dataSet['designs']);
					viewDataSet['designs'] = clone(dataSet['designs']);
					initPaginator(dataSet['designs'],'designs');
					paginatorDelete('designs');
				}
				
			}
			
		})
	}
	
	
	
	function createConnectionEntry(data, target){
		
		var objectsContainer = createContainer('col-sm-12',target+"-objects");
		for (i=0; i < data.length; i++){
			var objectContainerOuter = createContainer('col-sm-3');
			var objectContainerInner = createContainer('tox-connection col-sm-12');
			var jData = data[i];
			
			var iconContainer = createContainer('tox-icon-container col-xs-2 col-xs-offset-10');
			
			var objectIcon = createElement('img','tox-connection-icon',undefined,{"src": daoInfosIcon['Mail Design']});
			
			iconContainer.appendChild(objectIcon);
//			objectContainerInner.appendChild(objectIcon);
			objectContainerInner.appendChild(iconContainer);
			var objects = new Object();
			
			var containerInner = createContainer('col-sm-12 tox-connection-inner');
			 
			$.each(jData, function(k,v){
				if (optionsToShow[k].isShow){
					var container = createContainer('col-sm-12 tox-option-container');
					var titleContainer = createContainer('tox-connection-option');
					var valueContainer = createContainer('tox-connection-option');
					var option = optionsToShow[k].optionName;
					var titleSpan = createElement('span', 'bold', undefined, undefined, option +":&nbsp;");
					var value = v;
					var valueSpan = createElement('span', undefined, undefined, undefined, value);
					titleContainer.appendChild(titleSpan);
					valueContainer.appendChild(valueSpan);
					container.appendChild(titleContainer);
					container.appendChild(valueContainer);
					objects[k] = container;
				}
			});	
			$.each(objects, function(k,v){
				//objectContainerInner.appendChild(v);
				containerInner.appendChild(v);
			});
			
			objectContainerInner.appendChild(containerInner);
			
			var buttonContainer = createContainer("tox-button-container col-sm-12");
			if (target=='designs'){
				var editButton = createElement('a', 'command_edit col-sm-2 col-sm-offset-1',undefined,{"title":"Edit template","data-target":jData[1], "data-objectid":jData[0], "data-objecttype": jData[3]});
				var editButtonIcon = createElement('img',undefined, undefined,{"src":"images/edit_conn.png"});
				editButton.appendChild(editButtonIcon);
				var showButton = createElement('a', 'command-show col-sm-2',undefined,{"title":"View details","data-target":jData[1], "data-objectid":jData[0], "data-objecttype": jData[3]});
				var showButtonIcon = createElement('img',undefined, undefined,{"src":"images/search_green.png"});
				showButton.appendChild(showButtonIcon);
				var uploadButton = createElement('a', 'command-topmost  col-sm-2',undefined,{"title":"Make a copy","data-target":jData[1], "data-objectid":jData[0]});
				var uploadButtonIcon = createElement('img',undefined, undefined,{"src":"images/copy_green.png"});
				uploadButton.appendChild(uploadButtonIcon);
				var exportButton = createElement('a', 'command-export  col-sm-2',undefined,{"title":"Export","data-target":jData[1], "data-objectid":jData[0]});
				var exportButtonIcon = createElement('img',undefined, undefined,{"src":"images/export_green.png"});
				exportButton.appendChild(exportButtonIcon);
				var deleteButton = createElement('a', 'command-remove  col-sm-2',undefined,{"data-target":jData[1],"title":"Remove", "data-objectid":jData[0]});
				var deleteButtonIcon = createElement('img',undefined, undefined,{"src":"images/delete_green.png"});
				deleteButton.appendChild(deleteButtonIcon);
				buttonContainer.appendChild(editButton);
				buttonContainer.appendChild(showButton);
				buttonContainer.appendChild(uploadButton);
				buttonContainer.appendChild(exportButton);
				buttonContainer.appendChild(deleteButton);
			} 
			objectContainerInner.appendChild(buttonContainer);
			
			objectContainerOuter.appendChild(objectContainerInner);
			objectsContainer.appendChild(objectContainerOuter);
		}
//		connectionsContainer.appendChild(paginatorCreate(data));
		$("."+target).append(objectsContainer);
		var paginatorContainer = paginatorCreate(data,target);
		$("."+target).append(paginatorContainer);
	}
	
	function clearConnectionEntry(target){
		var el = document.getElementById(target+'-objects');
		try{
			el.parentNode.removeChild(el);
		} catch (e){}
	}
	
	function initPaginator(data, target){
		entryPerPage[target] = parseInt($("#"+target+"-paginator").val());
		if (!entryPerPage[target] || entryPerPage[target]<=0){
			entryPerPage[target] = 1;
			$("#"+target+"-paginator").val(1);
		}
		totalPages[target] = Math.ceil(data.length/entryPerPage[target]);
		currentPage[target] = 1;
	}
	function paginatorDelete(target){
		try{
			var el = document.getElementById('tox-paginator-container-'+target);
			el.parentNode.removeChild(el);
		} catch(e){}
	}
	
	function paginatorCreate(data,target){
		
//		try{
//			var el = document.getElementById('tox-paginator-container-'+target);
//			el.parentNode.removeChild(el);
//		} catch(e){}
		
		paginatorDelete(target);		
		if (!data.length) return false;
		var paginationClass = "";
		if (totalPages[target] == 1) paginationClass = "disabled";
		var paginatorContainer = createElement('nav',undefined,"tox-paginator-container-"+target);
		var paginatorUl = createElement('ul', "pagination pagination-sm");
		var paginationPreviousLi = createElement('li',"disabled","tox-prev-page-"+target);
		var paginationPreviousLiA = createElement('a',"tox-prev",undefined,{"aria-label":"Previous", "data-target":target});
		var paginationPreviousLiASpan = createElement('span',undefined,undefined,{"aria-hidden":"true"}, "&laquo;");
		paginationPreviousLiA.appendChild(paginationPreviousLiASpan);
		paginationPreviousLi.appendChild(paginationPreviousLiA);
		paginatorUl.appendChild(paginationPreviousLi);
		var pageClass = "active";
		for (i=1; i<=totalPages[target]; i++){
			var paginationLi = createElement('li', pageClass, "tox-page-"+target+"-"+i);
			var paginationLiA = createElement('a',"tox-page",undefined,{"data-page": i, "data-target":target},i);
			paginationLi.appendChild(paginationLiA);
			paginatorUl.appendChild(paginationLi);
			pageClass = "";
		}
		
		var paginationNextLi = createElement('li',paginationClass,"tox-next-page-"+target);
		var paginationNextLiA = createElement('a',"tox-next",undefined,{"aria-label":"Next", "data-target":target});
		var paginationNextLiASpan = createElement('span',undefined,undefined,{"aria-hidden":"true"}, "&raquo;");
		paginationNextLiA.appendChild(paginationNextLiASpan);
		paginationNextLi.appendChild(paginationNextLiA);
		paginatorUl.appendChild(paginationNextLi);
		
		paginatorContainer.appendChild(paginatorUl);
		return paginatorContainer;
	}
	
	function paginator(data,target){
		//var pageNumber = Math.ceil(data.length / entryNumber);
		if(0 < currentPage[target] <= totalPages[target]){
			return data.slice((currentPage[target]-1)*entryPerPage[target], (currentPage[target])*entryPerPage[target]);
		} else if (currentPage[target] > totalPages[target]){
			return data.slice(totalPages[target]*entryPerPage[target]);
		} else {
			return data.slice(0,entryPerPage[target]);
		}
		
	}
	
	function selectPage(target){
		clearConnectionEntry(target);
        createConnectionEntry(paginator(viewDataSet[target],target),target);
        $("#tox-paginator-container-"+target+" li").toggleClass("active", false);
        $("#tox-page-"+target+"-"+currentPage[target]).toggleClass("active", true);
        if (currentPage[target] == 1) {
        	$('#tox-prev-page-'+target).toggleClass("disabled", true);
    	} else {
    		$('#tox-prev-page-'+target).toggleClass("disabled", false);
    	}
        
        if (currentPage[target] == totalPages[target]) {
        	$('#tox-next-page-'+target).toggleClass("disabled", true);
    	} else {
    		$('#tox-next-page-'+target).toggleClass("disabled", false);
    	}
	}
	
	function paginatorOnChange(target){
		initPaginator(viewDataSet[target],target);
 		clearConnectionEntry(target);
		createConnectionEntry(paginator(viewDataSet[target],target),target);
	}
	
	function filterEntry(target, filteringAttrIndex, renew = false){
		var searchExpression = $("#"+target+"-filter").val().toLowerCase();
 		var data = !renew?filteredDataSet[target]:dataSet[target];
		viewDataSet[target] = [];
 		$.each(data, function(k,v){
 			
 			var jData = v[filteringAttrIndex];
 			if (jData.toLowerCase().indexOf(searchExpression) > -1){
 				viewDataSet[target].push(data[k]);
 			}		
 		});
 		initPaginator(viewDataSet[target],target);
 		clearConnectionEntry(target);
		createConnectionEntry(paginator(viewDataSet[target],target),target);
	}