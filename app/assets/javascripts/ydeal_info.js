function ydeal_info_test() {
}
function ydeal_info_init() {
	$('.tabs').tabs();
	
	$("a[rel=dealname]").die("click");
	$("a[rel=dealname]").live("click",function(){
		if($(".dish_custom").hasClass("hide")) {
			$(".dish_custom").removeClass("hide");
			$(".dish_custom").show();
		}
		else{
			$(".dish_custom").addClass("hide");
			$(".dish_custom").hide();
		}
		console.log("hello");
		return false;
	});


    $("a[rel=twipsy]").twipsy({
        placement: 'below',
		offset: 2,
		live: true
    });
    $("a[rel=twipsy2]").twipsy({
        placement: 'right',
		offset: 2,
		live: true
    });

    $("a[rel=popover]").popover({
        placement: 'above',
		offset: 20
      }).click(function(e) {
        e.preventDefault()
    });
    $(".mydish_price_col").hover(function(){
		$(".mydish_delete").show();
      },function() {
		$(".mydish_delete").hide();
    });

	$(".mydish_delete").click(function(){
		console.log('hello');
		$(".alert-message").alert();
		$(".alert-message").show();
    });

    $(".order_dish").hover(function(){
		$(".deal_order").show();
      },function() {
		$(".deal_order").hide();
    });

	$(".deal_order").click(function(){
		console.log('quick order!');
		//$(".alert-message").alert();
		//$(".alert-message").show();
		//$("#modal-from-dom").alert();
		
    });
}


