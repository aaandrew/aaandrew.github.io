
$(document).ready(function(){
	console.log("hi")

	$('body').mouseover(function(e){
		$("#marshmallow").offset({
       left:  e.pageX,
       top:   e.pageY
    });

		var width = $(window).width();

		if(e.pageX < width/2){
			$("#marshmallow").css({color:'red'});
		}else{
			$("#marshmallow").css({color:'blue'});
		}
	});
	
});