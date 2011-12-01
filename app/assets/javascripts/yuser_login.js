function yuser_edit_init() {
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
      
	$("#formUsrEdit_btn").die("click");
	$("#formUsrEdit_btn").live("click",function(){
		console.log("formUsrEdit_btn");
		return usr_edit_validate();
    }); 
}

function usr_edit_validate() { 
	inputs = $('#formUsrEdit').find(".required :input").removeClass("error");
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
	$('#alert_area').empty().append(show_alert("success","恭喜!","更新成功."));
	$('#alert_area').children(".alert-message").fadeIn("slow");
    //console.log('About to submit: \n\n' + queryString); 
 
	return true; 
}


/* ################################################################################################### */

function yuser_signup_init() {
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

    // bind form using ajaxForm
    /*var signup_options = { 
      	url: '/auth/identity/register',
    	type:'POST',
    	beforeSubmit: signup_validate,
    	success:      signup_success  // post-submit callback 
    };	

    // bind to the form's submit event 
    $("#formSignup").submit(function(event) { 
    	console.log("form.submit:enter");

		// inside event callbacks 'this' is the DOM element so we first 
	    // wrap it in a jQuery object and then invoke ajaxSubmit 
	    $(this).ajaxSubmit(signup_options); 
    
        // !!! Important !!! 
        // always return false to prevent standard browser submit and page navigation 
        return false; 
    });*/
    
      
	$("#formSignup_btn").die("click");
	$("#formSignup_btn").live("click",function(){
		console.log("formSignup_btn2");
		return signup_validate();
    }); 
}

function signup_validate() { 
	inputs = $('#formSignup').find(".required :input").removeClass("error");
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
	$('#alert_area').empty().append(show_alert("success","恭喜!","註冊成功."));
	$('#alert_area').children(".alert-message").fadeIn("slow");
    //console.log('About to submit: \n\n' + queryString); 
 
	return true; 
}

function signup_success(responseText, statusText, xhr, $form)  { 
	location.href = "/";
}

/* ################################################################################################### */
function yuser_login_init() {
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

    /*var signin_options = { 
      	url: '/auth/identity/callback',
    	type:'POST',
    	beforeSubmit: signin_validate,
    	success:      signin_success,  // post-submit callback 
    	failure:      signin_failure
    };	

    // bind to the form's submit event 
    $("#formSignin").submit(function(event) { 
    	console.log("form.submit:enter");

		// inside event callbacks 'this' is the DOM element so we first 
	    // wrap it in a jQuery object and then invoke ajaxSubmit 
	    $(this).ajaxSubmit(signin_options); 
    
        // !!! Important !!! 
        // always return false to prevent standard browser submit and page navigation 
        return false; 
    });*/ 

	$("#formSignin_btn").die("click");
	$("#formSignin_btn").live("click",function(){
		console.log("formSignin_btn");
		return signin_validate();
    }); 
}

function signin_validate() { 
	inputs = $('#formSignin').find(".required :input").removeClass("error");
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

function signin_success(responseText, statusText, xhr, $form)  { 
	console.log("signin_success!!",responseText,statusText,xhr);
	//location.href = "/";
}

function signin_failure(responseText, statusText, xhr, $form)  { 
	console.log("signin_failure!!",responseText,statusText,xhr);
}
