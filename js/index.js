
$(document).ready(function(){

	$('body').mouseover(function(e){
		$marshmallow = $("#marshmallow");

		$marshmallow.animate({
			top:e.pageY-100,left:e.pageX
			},
			{
				queue:false,duration:50,easing:'linear'
			});

		if(Math.random()*100 > 95){
			var className = $marshmallow.attr('class');
			$marshmallow.removeClass(className);
			var currentSequence = parseInt(className[className.length-1]);
			var nextSequence = (currentSequence >= 4) ? currentSequence : currentSequence + 1;
			var newClass = className.substring(0,className.length-1) + nextSequence;
			$marshmallow.addClass(newClass);
		}

	});
	
});