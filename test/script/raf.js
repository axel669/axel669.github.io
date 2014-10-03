(function(){
	if(typeof(webkitRequestAnimationFrame)!="undefined")
	{
		requestFrame=webkitRequestAnimationFrame;
		cancelFrame=webkitCancelAnimationFrame||$.emptyf;
	}
	if(typeof(mozRequestAnimationFrame)!="undefined")
	{
		requestFrame=mozRequestAnimationFrame;
		cancelFrame=mozCancelAnimationFrame||emptyf;
	}
	if(typeof(oRequestAnimationFrame)!="undefined")
	{
		requestFrame=oRequestAnimationFrame;
		cancelFrame=oCancelAnimationFrame||emptyf;
	}
	if(typeof(requestAnimationFrame)!="undefined")
	{
		requestFrame=requestAnimationFrame;
		cancelFrame=cancelAnimationFrame||emptyf;
	}
	if(requestFrame===null)
	{
		requestFrame=function(f){
			return setTimeout(f,15);
		};
		cancelFrame=function(id){
			clearTimeout(id);
		};
	}
	var _requestFrame=function(f){
		return requestFrame.call(window,f);
	};
	
	function frameListener(f)
	{
		var go=true;
		function caller(i)
		{
			if(go)
				requestFrame(caller);
			f.call(window,i);
		}
		requestFrame(caller);
		return {
			stop:function(){go=false;}
		};
	}
	
	window.requestAnimFrame=_requestFrame;
	window.frameListener=frameListener;
})();
