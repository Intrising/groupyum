function ymsg_new_init() {
    $(".single_field").hover(function(){
    	$(this).addClass("error").children(".input").children("span").fadeIn("slow");
      },function() {
        if($(this).children(".input").children("input").is(":focus")==false)
    	    $(this).removeClass("error").children(".input").children("span").fadeOut("slow");
    });
    
    $("input.xlarge").blur(function() {
        if($(this).parent().parent().is(":hover")==false) {
    	    $(this).siblings("span").fadeOut("slow");
    	    $(this).parent().parent().removeClass("error");
            console.log('Handler for .blur() called.');
        }
    });            
      
	$("#formNewMsg_btn").die("click");
	$("#formNewMsg_btn").live("click",function(){
		console.log("formNewMsg_btn");
		return msg_new_validate();
    }); 
}

function msg_new_validate() { 
	inputs = $('#formNewMsg').find(".required :input").removeClass("error");
	empty = inputs.filter(function() {
		return $(this).val().replace(/\s*/g, '') == '';
	});
	if (empty.length) {
		// add a CSS class name "error" for empty & required fields
		empty.parent().parent().addClass("error").children(".input").children("span").fadeIn("slow");
		$('#alert_area').empty().append(show_alert("error","輸入錯誤!","必填欄位不可空白."));
		$('#alert_area').children(".alert-message").fadeIn("slow");
		return false;
	}
    
	// hide the drawer
	$('#alert_area').empty().append(show_alert("success","恭喜!","成功."));
	$('#alert_area').children(".alert-message").fadeIn("slow");
 
	return true; 
}


