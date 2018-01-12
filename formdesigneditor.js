	
//	function delthis(item) {
//		if($(item).parent().parent().parent().parent().parent().parent().parent().attr('id') != 'defaults') {
//			$(item).parent().parent().parent().parent().parent().parent().remove();
//		}
//	};

	function delthis(event,item){
		if ($(item).parents('ul').attr('id') != 'defaults' && !$("#preview").prop("checked")){
			if (!$(item).parents('#viewer').length){
				event.stopPropagation();
				$(item).parents('li').remove();
			}
		}
	}
	
	function replaceundef(str) {
		if (typeof str === 'undefined') str = "";
		return str;
	}
	
	function editthis(item) {
		// If not in defaults (toolbox)
		if (!$(item).parents('#viewer').length){
			if($(item).parent().attr('id') != 'defaults' && !$("#preview").prop("checked")) {
				// If there is no ID yet make one
				if (typeof $(item).attr('id') === 'undefined' ) 
					$(item).attr('id',UUID.create());
				// Now create the edit box for this item with this id
				$("#properties .modal-body").empty();
				var editprops="<div class=\"editprops row\" id=\"editprops\"><tr>";
				if ($(item).attr('name') != 'ed_buttons' && $(item).attr('name') != 'ed_hr') editprops+="<label class='col-sm-3  control-label'>Label</label><div class='col-sm-8'><input class='form-control' type=\"text\" size=\"30\" onkeyup=\"javascript:updateField('"+$(item).attr('id')+"','label',$(this).val())\" value=\""+ replaceundef($(item).attr('label')) +"\"/></div>";
	
				if ($(item).attr('name') == 'ed_radiopick') editprops+="<label class='col-sm-3 control-label'>Values</label><div class='col-sm-8'><textarea class='form-control' rows=\"10\" cols=\"30\" onkeyup=\"javascript:updateRadios('"+$(item).attr('id')+"',$(this).val())\">"+replaceundef($(item).attr('data'))+"</textarea></div>";
				
				if ($(item).attr('name') == 'ed_mvcheckbox') editprops+="<label class='col-sm-3 control-label'>Values</label><div class='col-sm-8'><textarea class='form-control' rows=\"10\" cols=\"30\" onkeyup=\"javascript:updateCheckboxes('"+$(item).attr('id')+"',$(this).val())\">"+replaceundef($(item).attr('data'))+"</textarea></div>";
				
				if ($(item).attr('name') == 'ed_dndisplay') editprops+="<label class='col-sm-3 control-label'>Values</label><div class='col-sm-8'><input class='form-control' type=\"text\" onkeyup=\"javascript:updateField('"+$(item).attr('id')+"','dndisplay',$(this).val())\" value=\""+ replaceundef($(item).attr('dndisplay')) +"\"></div>";
				
				if ($(item).attr('name') == 'ed_globalpick') editprops+="<label class='col-sm-3 control-label'>Values</label><div class='col-sm-8'><textarea class='form-control' rows=\"10\" cols=\"30\" onkeyup=\"javascript:updatePickList('"+$(item).attr('id')+"',$(this).val())\">"+replaceundef($(item).attr('data'))+"</textarea></div>";
				
				if ($(item).attr('name') == 'ed_picklist') editprops+="<label class='col-sm-3 control-label'>Values</label><div class='col-sm-8'><textarea class='form-control' rows=\"10\" cols=\"30\" onkeyup=\"javascript:updatePickList('"+$(item).attr('id')+"',$(this).val())\">"+replaceundef($(item).attr('data'))+"</textarea></div>";
				if ($(item).attr('name') == 'ed_picklist') editprops+="<label class='col-sm-3 control-label'>Size</label><div class='col-sm-8'><input class='form-control' type=\"text\" onkeyup=\"javascript:updateAttr('"+$(item).attr('id')+"','select','size',$(this).val())\" value=\""+ replaceundef($(item).attr('size')) +"\"></div>";
				
				if ($(item).attr('name') == 'ed_pickfield') editprops+="<label class='col-sm-3 control-label'>Values</label><div class='col-sm-8'><textarea class='form-control' rows=\"10\" cols=\"30\" onkeyup=\"javascript:updateMVPickList('"+$(item).attr('id')+"',$(this).val())\">"+replaceundef($(item).attr('data'))+"</textarea></div>";
				if ($(item).attr('name') == 'ed_pickfield') editprops+="<label class='col-sm-3 control-label'>Size</label><div class='col-sm-8'><input class='form-control' type=\"text\" onkeyup=\"javascript:updateAttr('"+$(item).attr('id')+"','select','size',$(this).val())\" value=\""+ replaceundef($(item).attr('size')) +"\"></div>";
				
				if ($(item).attr('name') == 'ed_pickfield'  || $(item).attr('name') == 'ed_objektfield'){ 
					var cls = {};
					cls['choose'] = $(item).find("img[name='choose']").hasClass('hidden')?'turnoff':'';
					cls['lupe'] = $(item).find("img[name='lupe']").hasClass('hidden')?'turnoff':'';
					cls['rubber'] = $(item).find("img[name='rubber']").hasClass('hidden')?'turnoff':'';
					cls['delete'] = $(item).find("img[name='delete']").hasClass('hidden')?'turnoff':'';
					
					editprops+="<label class='col-sm-3 control-label'>Icons</label><div class='col-sm-8'><img width='14px' src=\"images/export_green.png\" class='button-icon "+cls['choose']+"' onclick=\"javascript:updateIcons(this,'"+$(item).attr('id')+"','choose')\">\
													<img width='14px' src=\"images/search_green.png\" class='button-icon "+cls['lupe']+"' onclick=\"javascript:updateIcons(this,'"+$(item).attr('id')+"','lupe')\">\
													<img width='14px' src=\"images/edit_conn.png\" class='button-icon "+cls['rubber']+"' onclick=\"javascript:updateIcons(this,'"+$(item).attr('id')+"','rubber')\">\
													<img width='14px' src=\"images/delete_green.png\" class='button-icon "+cls['delete']+"' onclick=\"javascript:updateIcons(this,'"+$(item).attr('id')+"','delete')\"></div>";
				}
				if ($(item).attr('name') == 'ed_selectlist') editprops+="<label class='col-sm-3 control-label'>Value</label><div class='col-sm-8'><textarea class='form-control' rows=\"10\" cols=\"30\" onkeyup=\"javascript:updateMVSelectList('"+$(item).attr('id')+"',$(this).val())\">"+replaceundef($(item).attr('data'))+"</textarea></div>";
				if ($(item).attr('name') == 'ed_selectlist') editprops+="<label class='col-sm-3 control-label'>Size</label><div class='col-sm-8'><input class='form-control' type=\"text\" onkeyup=\"javascript:updateAttr('"+$(item).attr('id')+"','select','size',$(this).val())\"  value=\""+ replaceundef($(item).attr('size')) +"\"></div>";
				
				if ($(item).attr('name') == 'ed_html') editprops+="<label class='col-sm-3 control-label'>Value</label><div class='col-sm-8'><textarea class='form-control' rows=\"10\" cols=\"30\" onkeyup=\"javascript:updateField('"+$(item).attr('id')+"','somehtml',$(this).val())\">"+replaceundef($(item).attr('somehtml'))+"</textarea></div>";
				
				if ($(item).attr('name') == 'ed_buttons') editprops+="<label class='col-sm-3 control-label'>Values</label><div class='col-sm-8'><textarea class='form-control' rows=\"10\" cols=\"30\" onkeyup=\"javascript:updateButtons('"+$(item).attr('id')+"',$(this).val())\">"+replaceundef($(item).attr('data'))+"</textarea></div>";
				
	//			if ($(item).attr('name') == 'ed_objektfield') editprops+="<tr><td>Icons</td><td><img src=\"images/export_white.png\" class='"$(item).find("img[name='choose']").hasClass('hidden')?'turnoff':''"' onclick=\"javascript:updateIcons(this,'"+$(item).attr('id')+"','choose')\">\
	//																		<img src=\"images/search_white.png\" class='"$(item).find("img[name='lupe']").hasClass('hidden')?'turnoff':''"' onclick=\"javascript:updateIcons(this,'"+$(item).attr('id')+"','lupe')\">\
	//																		<img src=\"images/edit_white.png\" class='"$(item).find("img[name='rubber']").hasClass('hidden')?'turnoff':''"' onclick=\"javascript:updateIcons(this,'"+$(item).attr('id')+"','rubber')\">\
	//																		<img src=\"images/del.png\" class='"$(item).find("img[name='delete']").hasClass('hidden')?'turnoff':''"' onclick=\"javascript:updateIcons(this,'"+$(item).attr('id')+"','delete')\"></td></tr>";
	
				
				editprops+="</div>";
				$("#properties .modal-body").append(editprops);
				if ($(item).attr('name') != 'ed_hr') $('#properties').modal('show');
			} else {
				if ($(item).parent().attr('id') == 'defaults') {
					$("#formsort").append($(item).clone());
					preventClicks();
				}
			}
		}
	}
	
	function updateField(theid,thename,thevalue) {
		$("#"+theid).find("*[name='"+thename+"']").html(thevalue);
		$("#"+theid).attr(thename,thevalue);
	}
	
	function updateAttr(theid,theobj,theattr,thevalue) {
		$("#"+theid).find(theobj).attr(theattr,thevalue);
		$("#"+theid).attr(theattr,thevalue);
	}
	
	function updateIcons(item,theid,theicon) {
		$("#"+theid).find("img[name='"+theicon+"']").toggleClass('hidden');
		$(item).toggleClass('turnoff');
	}
	
	function updateRadios(theid,thevalues) {
		$("#"+theid).find("div[name='radios']").empty()
		var lines = thevalues.split('\n');
		$.each(lines, function(){
			$("#"+theid).find("div[name='radios']").append("<input name=\"radio_"+theid+"\" type=\"radio\">" + this);
		});	
		$("#"+theid).attr("data",thevalues);
	}
	function updateCheckboxes(theid,thevalues) {
		$("#"+theid).find("div[name='boxes']").empty()
		var lines = thevalues.split('\n');
		$.each(lines, function(){
			$("#"+theid).find("div[name='boxes']").append("<input name=\"check_"+theid+"\" type=\"checkbox\">" + this);
		});	
		$("#"+theid).attr("data",thevalues);
	}
	function updateButtons(theid,thevalues) {
		$("#"+theid).find("div[name='buttons']").empty()
		var lines = thevalues.split('\n');
		$.each(lines, function(){
			$("#"+theid).find("div[name='buttons']").append("<input class='btn btn-sm btn-default' name=\"check_"+theid+"\" type=\"button\" value=\""+this+"\">");
		});	
		$("#"+theid).attr("data",thevalues);
	}
	function updatePickList(theid,thevalues) {
		$("#"+theid).find("div[name='picks']").empty()
		var lines = thevalues.split('\n');
		var newstuff = "<select class='form-control'>";
		$.each(lines, function(){
			newstuff += "<option>" + this + "</option>";
		});
		newstuff += "</select>";
		$("#"+theid).find("div[name='picks']").append(newstuff);
		$("#"+theid).attr("data",thevalues);
	}
	function updateMVPickList(theid,thevalues) {
		var size = $("#"+theid).find('select').attr('size');
		$("#"+theid).find("div[name='picks']").empty()
		var lines = thevalues.split('\n');
		var newstuff = "<select multiple size=\""+size+"\"  class=\"form-control\" >";
		$.each(lines, function(){
			newstuff += "<option>" + this + "</option>";
		});
		newstuff += "</select>";
		$("#"+theid).find("div[name='picks']").append(newstuff);
		$("#"+theid).attr("data",thevalues);
	}
	function updateMVSelectList(theid,thevalues) {
		var size = $("#"+theid).find('select').attr('size');
		$("#"+theid).find("div[name='picks']").empty()
		var lines = thevalues.split('\n');
		var newstuff = "<div class='col-sm-5'><select multiple size=\""+size+"\" class=\"form-control\">";
		$.each(lines, function(){
			newstuff += "<option>" + this + "</option>";
		});
		newstuff += "</select></div><div class='col-sm-2'><img src=\"images/formdesign/rightleft.png\"/></div><div class='col-sm-5'><select multiple size=\""+size+"\"  class=\"form-control\" ></select></div>";
		$("#"+theid).find("div[name='picks']").append(newstuff);
		$("#"+theid).attr("data",thevalues);
	}
	
	function preventClicks() {
		$(".infoicon").click( function(e) { e.stopPropagation(); e.preventDefault(); return false; } );
		$(".delicon").click( function(e) { e.stopPropagation(); e.preventDefault(); return false; } );
	}


