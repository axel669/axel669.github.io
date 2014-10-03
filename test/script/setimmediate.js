;(function(){

if(window && typeof(window.setImmediate)==="undefined")
{
	var immediates={};
	window.setImmediate=function(f){
		var id=Date.now()+""+Math.random();
		var args=slice(arguments,1);
		var evt=function(event){
			if(event.data===id)
			{
				f.apply(window,args);
				window.removeEventListener("message",evt);
				delete immediates[id];
			}
		};
		immediates[id]=evt;
		window.addEventListener("message",evt);
		window.postMessage(id,"*");
		return id;
	}
	window.clearImmediate=function(id){
		if(hasOwn(immediates,id))
		{
			window.removeEventListener('message',immediates[id]);
			delete immediates[id];
		}
	};
}

})();
