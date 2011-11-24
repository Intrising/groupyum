function yshop_show_init() {
    $("a[rel=twipsy]").twipsy({
        offset: 10,
    	live: true
    });
    $("a[rel=popover]").popover({
        placement: 'above',
    	offset: 20
      }).click(function(e) {
        e.preventDefault()
    })
    
    $('.tabs').tabs();
    
    $(".shop_cat").die("click");
    $(".shop_cat").live("click",function(){
    	if($(this).hasClass($(this).attr('rel'))) {
    		$(this).removeClass($(this).attr('rel'));
    	}
    	else{
    		$(this).addClass($(this).attr('rel'));
    	}
    	//console.log("click,shop_cat",$(this).attr('rel'));
    	return false;
    });
}

