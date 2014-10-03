;(function(window){
	"use strict";
	function Class(_class)
	{
		if(!(this instanceof Class))
			return new Class(_class);
		this._class=_class;
	}
	Class.prototype.inherit=function(parent){
		this._class.prototype=Object.create(parent.prototype);
		return this;
	};
	Class.prototype.methods=function(methods){
		for(var key in methods)
		{
			if(!methods.hasOwnProperty(key))
				continue;
			var info=methods[key];
			if(info.get || info.set)
			{
				var item={enumerable:true};
				if(info.get)
					item.get=info.get;
				if(info.set)
					item.set=info.set;
				Object.defineProperty(this._class.prototype,key,item);
			}
			else
				Object.defineProperty(this._class.prototype,key,{enumerable:false,writable:false,value:info});
		}
	};
	window.Class=Class;
})(window);