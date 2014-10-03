;(function(){
	if(typeof(window.requestFrame)!=="undefined")
		return;
	
	function emptyf(){}
	if(typeof(webkitRequestAnimationFrame)!=="undefined")
	{
		requestFrame=webkitRequestAnimationFrame;
		cancelFrame=webkitCancelAnimationFrame||emptyf;
	}
	if(typeof(mozRequestAnimationFrame)!=="undefined")
	{
		requestFrame=mozRequestAnimationFrame;
		cancelFrame=mozCancelAnimationFrame||emptyf;
	}
	if(typeof(oRequestAnimationFrame)!=="undefined")
	{
		requestFrame=oRequestAnimationFrame;
		cancelFrame=oCancelAnimationFrame||emptyf;
	}
	if(typeof(requestAnimationFrame)!=="undefined")
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
	
	window.requestAnimFrame=_requestFrame;
})();

;(function(){
	if(typeof(window.setImmediate)==="undefined")
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

;(function(){
	"use strict";
	function EventEmitter()
	{
		this.__events__={};
	}
	var proto=EventEmitter.prototype;
	Object.defineProperty(proto,'on',{
		value:function(type,listener){
			var evts=this.__events__;
			if(!evts.hasOwnProperty(type))
				evts[type]=[];
			evts[type].push(listener);
			return this;
		},
		enumerable:false
	});
	Object.defineProperty(proto,'off',{
		value:function(type,listener){
			if(listener===undefined)
				this.__events__[type]=[];
			else
			{
				var list=this.__events__[type];
				var index=list.indexOf(listener);
				if(index!==-1)
					list.splice(index,1);
			}
			return this;
		},
		enumerable:false
	});
	Object.defineProperty(proto,'emit',{
		value:function(type,data){
			var list=this.__events__[type];
			if(list===undefined || list.length===0)
				return;
			var x=-1;
			var self=this;
			while(++x<list.length)
			{
				var f=list[x];
				setImmediate(function(){f.call(self,data);});
			}
		},
		enumerable:false
	});
	
	if(typeof(window)!=='undefined') window.EventEmitter=EventEmitter;
	if(typeof(global)!=='undefined') global.EventEmitter=EventEmitter;
})();
