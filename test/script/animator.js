;(function(window){
	"use strict";
	function Animation(obj,style,base,range,duration,ease,postfix)
	{
		EventEmitter.call(this);
		
		var time=0;
		var timestamp=performance.now();
		this.nextFrame=null;
		this.__done=new promise();
		
		var self=this;
		function run()
		{
			var now=performance.now();
			var frame_time=now-timestamp;
			timestamp=now;
			
			time+=frame_time;
			if(time>duration)
				time=duration;
			
			obj.style[style]=(base+range*ease(time/duration))+postfix
			
			if(time<duration)
				self.nextFrame=requestAnimFrame(run);
			else
			{
				delete obj.__animations__[style];
				self.emit('finish',self);
			}
		}
		run();
	}
	Class(Animation).
	inherit(EventEmitter).
	methods({
		stop:function(){
			if(this.nextFrame!==null)
			{
				cancelFrame(this.nextFrame);
				this.nextFrame=null;
			}
		}
	});
	
	function animate(obj,style,duration,start,end,easing,postfix)
	{
		var animations=obj.__animations__||{};
		if(animations.hasOwnProperty(style))
			animations[style].stop();
		if(typeof(easing)==='string')
			easing=ease[easing];
		var anim=new Animation(obj,style,start,end-start,duration|0,easing||ease.linear,postfix||0);
		animations[style]=anim;
		obj.__animations__=animations;
		return anim;
	}
	function animateTo(obj,style,duration,to,easing,postfix)
	{
		var current=getComputedStyle(obj);
		var start=parseFloat(current[style]);
		return animate(obj,style,duration,start,to,easing,postfix);
	}
	
	var ease={
		linear:function(n){return n;},
		sine:function(n){return Math.sin(Math.PI/2*n);}
	};
	
	function datAnimate(selector,animations)
	{
		var elem=selector;
		if(typeof(selector)==='string')
			elem=document.querySelector(selector);
		for(var x=0;x<animations.length;++x)
		{
			var anim=animations[x];
			if(anim instanceof Array)
				animate.apply(null,[elem].concat(anim));
			else
				animate(elem,anim.style,anim.duration,anim.start,anim.end,anim.ease,anim.postfix);
		}
	}
	function datAnimateTo(selector,animations)
	{
		var elem=selector;
		if(typeof(selector)==='string')
			elem=document.querySelector(selector);
		for(var x=0;x<animations.length;++x)
		{
			var anim=animations[x];
			if(anim instanceof Array)
				animateTo.apply(null,[elem].concat(anim));
			else
				animateTo(elem,anim.style,anim.duration,anim.to,anim.ease,anim.postfix);
		}
	}
	
	window.Animator={
		start:animate,
		multiple:datAnimate,
		to:animateTo,
		multipleTo:datAnimateTo,
		ease:ease
	};
})(window);