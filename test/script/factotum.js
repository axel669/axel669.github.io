(function(){
//

"use strict";

if(!Object.defineProperty)
	throw new Error("Object.defineProperty is not supported in this browser");

var version="1.0";
var _undefined=(void 0);

var has_global=typeof(global)!="undefined";
var has_window=typeof(window)!="undefined";
var is_node=has_global;
var is_node_webkit=is_node && has_window;
var is_browser=!is_node && !is_node_webkit;
var __global__=has_global?global:{};
var __window__=has_window?window:{};

function Chain(obj)
{
	this.value=obj;
}
if(!Chain.prototype.constructor)
	Chain.prototype.constructor=Chain;
Chain.prototype.toString=function(){
	return this.value+"";
};

function factotum(obj)
{
	return new Chain(obj);
}
factotum.ChainClass=Chain;

(function(){
	if(__window__.attachEvent)
	{
		var meta=__window__.document.createElement("meta");
		meta.httpEquiv="X-UA-Compatible";
		meta.content="IE=9";
		__window__.document.getElementsByTagName("head")[0].appendChild(meta);
	}
})();

if(!Function.prototype.hasOwnProperty('name'))
{
	Object.defineProperty(Function.prototype,"name",{
		enumerable:false,
		get:function(){
			return this.toString().match(/^function\s*([\w\$_][\w\$\d_]*)?/)[1]||"Anonymous";
		}
	});
}

function makeGlobal(item,name)
{
	name=name||item.name;
	//log("Making "+name+" global");
	if(has_window) window[name]=item;
	if(has_global) global[name]=item;
}
makeGlobal(makeGlobal);

/**
	@type function
	@name log
	@global true
	@description
		Function for logging multiple arguments in separate console lines.
*/
function puts()
{
	for(var x=0;x<arguments.length;x++)
		console.log(arguments[x]);
	return arguments.length;
}
/**
	@type function
	@name error
	@global true
	@description
		Function for logging multiple errors in separate console lines.
*/
function putserr()
{
	for(var x=0;x<arguments.length;x++)
		console.error(arguments[x]);
	return arguments.length;
}
/**
	@type function
	@name cout
	@global
	@description
		Function for logging multiple arguments on the same console line. (just a wrapper around console.log)
*/
function log()
{
	console.log.apply(console,A(arguments));
	return arguments.length;
}
/**
	@type function
	@name cerr
	@global
	@description
		Function for logging multiple error on the same console line. (just a wrapper around console.error)
*/
function error()
{
	console.error.apply(console,A(arguments));
	return arguments.length;
}

factotum.log=log;
factotum.puts=puts;
factotum.error=error;
factotum.putserr=putserr;

var docstyle=has_window?window.document.documentElement.style:{};
makeGlobal({
	isNode:is_node,
	isBrowser:has_window,
	isNodeWebkit:is_node_webkit,
	window:__window__,
	global:__global__,
	hasWindow:has_window,
	hasGlobal:has_global,
	isMobile:'orientation' in __window__,
	browser:{
		firefox:'MozBoxSizing' in docstyle,
		firefox16:('transform' in docstyle) && !('-ms-transform' in docstyle),
		ie:'-ms-transform' in docstyle,
		opera:'-o-transform' in docstyle,
		webkit:'-webkit-transform' in docstyle,
	}
},"Environment");

if(has_window && typeof(window.setImmediate)==="undefined")
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


function A(iterable,start)
{
	var r=[];
	for(var x=start||0, e=iterable.length;x<e;x++)
		r.push(iterable[x]);
	return r;
}
//makeGlobal(A,"$A");


function createProperty(obj,name,prop)
{
	Object.defineProperty(obj,name,prop);
}

function addFunction(_class,name,f)
{
	createProperty(_class.prototype,name,{value:f,enumerable:false,writable:true});
}
function extendPrototype(_class,props)
{
	for(var key in props)
		addFunction(_class,key,props[key]);
}

// factotum.createProperty=createProperty;
// factotum.addFunction=addFunction;
// factotum.extendPrototype=extendPrototype;
// factotum.makeGlobal=makeGlobal;

var toString=Object.prototype.toString;
var push=Array.prototype.push;
var pop=Array.prototype.pop;

function Y(F){
	return (function(x){
		return F(function (y) { return (x(x))(y);});
	})(function (x){
		return F(function (y) { return (x(x))(y);});
	});
};

function substr(str,start,len)
{
	if (!str) return "";
	if(len<0) len=str.length+len;
	if(start<0) start=str.length+start;
	return str.substr(start,len);
}

function repeat(str,count,clip)
{
	clip=clip||0;
	var r=[], size=-1;
	while(++size<count)
		r.push(str);
	r=r.join('');
	if(clip>0 && r.length>clip)
		return r.substr(0,clip);
	return r;
}

function reverse(obj)
{
	if(typeof(obj)==='string')
		return obj.split('').reverse().join('');
	return obj.reverse();
}

function ljust(str,size,pattern)
{
	pattern=pattern||' ';
	var padding=size-str.length;
	return str+repeat(pattern,padding/pattern.length,padding);
}
function rjust(str,size,pattern)
{
	pattern=pattern||' ';
	var padding=size-str.length;
	return repeat(pattern,padding/pattern.length,padding)+str;
}
function center(str,size,pattern,noReverse)
{
	pattern=pattern||' ';
	var padding=(size-str.length);
	var rpad=(padding/2)|0, lpad=rpad;
	if(rpad!==padding/2) ++rpad;
	return repeat(pattern,Math.ceil(rpad/pattern.length),rpad)+str+repeat(noReverse?pattern:reverse(pattern),Math.ceil(lpad/pattern.length),lpad);
}

function trim(str)
{
	var start=0, end=str.length-1;
	var c;
	while((c=str.charCodeAt(start))!==-1 && ((c>=8 && c<=13) || c===32))
		start++;
	while((c=str.charCodeAt(end))!==-1 && ((c>=8 && c<=13) || c===32))
		end--;
	++end;
	if(start>=end) return "";
	return str.substring(start,end);
}

function className(obj)
{
	return substr(toString.call(obj).split(' ')[1],0,-1);
}


var argumentsClass=className(arguments);

function isArray(obj)
{
	return obj instanceof Array;
}
function isArguments(obj)
{
	return className(obj)===argumentsClass;
}
function isIterable(obj)
{
	return typeof(obj)==='object' && typeof(obj.length)==='number';
}


function hasOwn(obj,prop)
{
	return obj.hasOwnProperty(prop);
}

function range(n,f)
{
	f=f||valueFunction(0);
	var r=new Array(n);
	var index=-1;
	while(++index<n)
		r[index]=f(index);
	return r;
}

function unique(array)
{
	var found={}, r=[], index=-1, len=array.length;
	while(++index<len)
	{
		var val=array[index];
		if(found.hasOwnProperty(val))
			continue;
		found[val]=null;
		r.push(val);
	}
	return r;
}

function concat()
{
	if(typeof(arguments[0])==='string')
	{
		var r=arguments[0], i=0, e=arguments.length;
		while(++i<e)
			r+=arguments[i];
		return r;
	}
	var r=[];
	var count=-1, end=arguments.length;
	while(++count<end)
	{
		var array=arguments[count];
		var index=-1, len=array.length;
		while(++index<len)
			r.push(array[index]);
	}
	return r;
}

function arrayEach(iterable,f,index)
{
	index=(index||0)-1;
	var len=iterable.length;
	while(++index<len)
		if(f(iterable[index],index,iterable)===false)
			break;
	return iterable;
}

function objectEach(obj,f,all)
{
	if(all)
	{
		for(var key in obj)
			if(f(obj[key],key,obj)===false)
				break;
	}
	else
	{
		for(var key in obj)
			if(hasOwn(obj,key))
				if(f(obj[key],key,obj)===false)
					break;
	}
	return obj;
}

function each(obj,f,index)
{
	if(typeof(obj)==='string')
		obj=obj.split('');
	if(typeof(obj)==='object' && typeof(obj.length)==='number')
		return arrayEach(obj,f,index);
	return objectEach(obj,f,index);
}

function eachRight(array,f,index)
{
	var index=array.length-(index||0);
	while(--index>-1)
		if(f(array[index],index,array)===false)
			break;
	return array;
}

function where(obj,test,self)
{
	self=self||null;
	if(typeof(test)==='string')
		test=new Function('item','return '+test);
	if(typeof(obj.length)==='number')
	{
		var r=[];
		arrayEach(obj,function(val,i,arr){
			if(test.call(self,val,i,arr))
				r.push(val);
		});
		return r;
	}
	var r={};
	objectEach(obj,function(value,key,obj){
		if(test.call(self,value,key,obj))
			r[key]=value;
	});
	return r;
}

function first(array,test,self)
{
	self=self||null;
	test=test||1;
	var index=-1, len=array.length;
	var size;
	if(typeof(test)==='number')
	{
		if(test===1) return array[0];
		size=test;
	}
	else
	{
		size=0;
		while(++index<len && test.call(self,array[index],index,array))
			++size;
	}
	return slice(array,0,size);
}

function last(array,test,self)
{
	self=self||null;
	test=test||1;
	var r=[], index=array.length, end=array.length-test-1;
	if(typeof(test)==='number')
	{
		if(test===1) return array[array.length-1];
		while(--index>end)
			r.unshift(array[index]);
		return r;
	}
	while(--index>-1)
	{
		if(test(array[index],index,array)===false)
			break;
		r.unshift(array[index]);
	}
	return r;
}

function arrayFind(array,test,returnValue)
{
	if(typeof(test)==='string')
		test=pluckTest(test);
	if(typeof(test)!=='function')
	{
		if(typeof(test)==='object')
			test=objectTest(test);
		else
			test=valueTest(test);
	}
	var index=-1, len=array.length;
	while(++index<len)
		if(test(array[index],index))
			return returnValue?array[index]:index;
	return returnValue?(void 0):-1;
}

function arrayFindLast(array,test,returnValue)
{
	if(typeof(test)==='string')
		test=pluckTest(test);
	if(typeof(test)!=='function')
	{
		if(typeof(test)==='object')
			test=objectTest(test);
		else
			test=valueTest(test);
	}
	var index = array.length;
	while(--index>-1)
		if(test(array[index]))
			return returnValue?array[index]:index;
	return returnValue?(void 0):-1;
}

function objectFind(obj,test,returnValue)
{
	if(typeof(test)==='string')
		test=pluckTest(test);
	if(typeof(test)!=='function')
	{
		if(typeof(test)==='object')
			test=objectTest(test);
		else
			test=valueTest(test);
	}
	for(var key in obj)
		if(test(obj[key]))
			return returnValue?obj[key]:key;
	return (void 0);
}

function objectFindLast(obj,test,returnValue)
{
	if(typeof(test)==='string')
		test=pluckTest(test);
	if(typeof(test)!=='function')
	{
		if(typeof(test)==='object')
			test=objectTest(test);
		else
			test=valueTest(test);
	}
	var last=[_undefined,_undefined];
	for(var key in obj)
		if(test(obj[key]))
			last=[obj[key],key];
	return returnValue?last[0]:last[1];
}

function find(obj,test,returnValue)
{
	if(typeof(obj.length)==='number')
		return arrayFind(obj,test,returnValue);
	return objectFind(obj,test,returnValue);
}
function findLast(obj,test,returnValue)
{
	if(typeof(obj.length)==='number')
		return arrayFindLast(obj,test,returnValue);
	return objectFindLast(obj,test,returnValue);
}

function flatten(array,shallow,getter,self)
{
	self=self||null;
	getter=makeGetter(getter);
	
	var r=[];
	var index=-1;
	var len=array.length;
	
	if(shallow)
	{
		var index2, len2;
		while(++index<len)
		{
			var value=getter.call(self,array[index]);
			if(typeof(value)==='object' && typeof(value.length)==='number')
			{
				index2=-1;
				len2=value.length;
				while(++index2<len2)
					r.push(getter.call(self,value[index2]));
			}
			else
				r.push(value);
		}
		return r;
	}
	var stack=[];
	while(++index<len)
	{
		var value=getter.call(self,array[index],index,array);
		if(typeof(value)==='object' && typeof(value.length)==='number')
		{
			stack.push({array:array,index:index});
			index=-1;
			array=value;
			len=array.length;
			continue;
		}
		r.push(value);
		while(index===len-1 && stack.length>0)
		{
			var next=stack.pop();
			array=next.array;
			len=array.length;
			index=next.index;
		}
	}
	return r;
}

function reduce(obj,accum,base,self)
{
	base=(base===undefined)?0:base;
	self=self||null;
	var pre;
	each(obj,function(value,key){
		pre=base;
		base=accum.call(self,base,value,key);
		if(base===_undefined) base=pre;
	});
	return base;
}

function reduceRight(obj,accum,base,self)
{
	base=base||0;
	self=self||null;
	var pre;
	eachRight(obj,function(value,key){
		pre=base;
		base=accum.call(self,base,value,key);
		if(base===_undefined) base=pre;
	});
	return base;
}

function index(obj,keyf,self)
{
	self=self||null
	keyf=makeGetter(keyf);
	var r={};
	each(obj,function(value){
		r[keyf(value)]=value;
	});
	return r;
}

function group(obj,keyf,self)
{
	self=self||null
	keyf=makeGetter(keyf);
	var r={};
	each(obj,function(value){
		var key=keyf(value);
		if(!hasOwn(r,key))
			r[key]=[];
		r[key].push(value);
	});
	return r;
}

function count(obj,keyf,self)
{
	self=self||null
	keyf=makeGetter(keyf);
	var r={};
	each(obj,function(value){
		var key=keyf(value);
		if(!hasOwn(r,key))
			r[key]=0;
		++r[key];
	});
	return r;
}

function slice(array,start,size)
{
	var len=array.length;
	start=start||0;
	size=size||(len-start);
	if(size<=0) return [];
	var end=start+size;
	var index=start-1;
	var r=new Array(size);
	while(++index<end)
		r[index-start]=array[index];
	return r;
}

function invoke(array,f)
{
	var args=slice(arguments,2);
	var index=-1, len=array.length;
	var r=new Array(len);
	var isf=typeof(f)==='function';
	while(++index<len)
	{
		var value=array[index];
		r[index]=(isf?f:value[f]).apply(value,args);
	}
	return r;
}

function map(obj,f,self,conserveType)
{
	self=self||null;
	f=makeGetter(f);
	var r;
	if(!conserveType || typeof(obj.length)==='number')
	{
		if(typeof(obj.length)==='number')
		{
			r=new Array(obj.length);
			var index=-1, len=obj.length;
			while(++index<len)
				r[index]=f.call(self,obj[index],index,obj);
		}
		else
		{
			r=[];
			for(var key in obj)
				if(hasOwn(obj,key))
					r.push(f.call(self,obj[key],key,obj));
		}
	}
	else
	{
		r={};
		objectEach(obj,function(value,key,obj){
			r[key]=f.call(self,value,key,obj);
		});
	}
	return r;
}

function pluck(obj,prop)
{
	var r=new Array(obj.length);
	each(obj,function(value,index){
		r[index]=value[prop];
	});
	return r;
}

function arrayCopy(array,deep,getter,self)
{
	getter=makeGetter(getter);
	self=self||null;
	if(!deep)
		return slice(array);
	var index=-1, len=array.length;
	var r=new Array(len);
	while(++index<len)
	{
		var val=getter.call(self,array[index],index,array);
		if(typeof(val)==='object')
			r[index]=copy(val,true,getter,self);
		else
			r[index]=val;
	}
	return r;
}

function objectCopy(obj,deep,getter,self)
{
	getter=makeGetter(getter);
	self=self||null;
	if(!deep)
		return map(obj,getter,self,true);
	var r={};
	objectEach(obj,function(value,key){
		value=getter.call(self,value,key,obj);
		if(typeof(value)==='object')
			r[key]=copy(value,true,getter,self);
		else
			r[key]=value;
	});
	return r;
}

function copy(obj,deep,getter,self)
{
	if(isIterable(obj))
		return arrayCopy(obj,deep,getter,self);
	return objectCopy(obj,deep,getter,self);
}

function invert(obj)
{
	var r={};
	if(typeof(obj.length)==='number')
		arrayEach(obj,function(value,key){
			r[value]=key;
		});
	else
		objectEach(obj,function(value,key){
			r[value]=key;
		});
	return r;
}

function pairs(obj)
{
	var r=[];
	objectEach(obj,function(value,key){
		r.push([key,value]);
	});
	return r;
}

function arrayMerge(dest,source,getter,self)
{
	var index=-1, len=source.length;
	while(++index<len)
	{
		var value=getter.call(self,source[index],index,source);
		if(index===dest.legnth)
		{
			dest.push(value);
			continue;
		}
		var old=dest[index];
		if(typeof(value)==='object' && typeof(old)==='object')
		{
			var t1=typeof(old.length), t2=typeof(value.length);
			if(t1==='number' && t2==='number')
				arrayMerge(old,value,getter,self);
			if(t1===t2)
				objectMerge(old,value,getter,self);
		}
		else
			dest[index]=source[index];
	}
}
function objectMerge(dest,source,getter,self)
{
	for(var key in source)
	{
		if(!hasOwn(source,key)) continue;
		var value=getter.call(self,source[key],key,source);
		if(value===_undefined) continue;
		var old=dest[key];
		if(old===_undefined || typeof(old)!=='object' || typeof(value)!=='object')
		{
			dest[key]=value;
			continue;
		}
		var t1=typeof(old.length), t2=typeof(value.length);
		if(t1==='number' && t2==='number')
			arrayMerge(old,value,getter,self);
		if(t1===t2)
			objectMerge(old,value,getter,self);
	}
}
function merge(dest)
{
	var getter=identityFunction;
	var self=null;
	var test=last(arguments,2);
	//log(getter,self,typeof(test[0]));
	if(typeof(test[0])==='function')
	{
		getter=test[0];
		self=test[1];
		test=3;
	}
	else if(typeof(test[1])==='function')
	{
		getter=test[1];
		test=2;
	}
	else
		test=1;
	var sources=slice(arguments,1,arguments.length-test);
	var index=-1, len=sources.length;
	var f=(typeof(dest.length)==='number')?arrayMerge:objectMerge;
	while(++index<len)
		f(dest,sources[index],getter,self);
	return dest;
}


function valueTest(value)
{
	return function(val){return val===value;};
}
function objectTest(obj)
{
	return function(other){
		for(var key in obj)
			if(hasOwn(obj,key) && other[key]!==obj[key])
				return false;
		return true;
	};
}
function pluckTest(value)
{
	return function(obj){
		return !!obj[value];
	};
}

function identityFunction(value)
{
	return value;
}
function valueFunction(value)
{
	return function(){return value;};
}
function pluckFunction(property)
{
	return function(obj){return obj[property];};
}

function makeGetter(getter)
{
	if(getter===_undefined) return identityFunction;
	if(typeof(getter)==='string') return pluckFunction(getter);
	return getter;
}


function bind(method,self)
{
	var args=slice(arguments,2);
	return function(){
		return method.apply(self,concat(args,arguments));
	};
}

function bindKey(obj,key)
{
	var args=slice(arguments,2);
	return function(){
		return obj[key].apply(obj,concat(args,arguments));
	};
}

function curry(f,prev)
{
	prev=prev||[];
	var args=concat(prev,slice(arguments,2));
	if(args.length===f.length)
		return f.apply(this,args);
	return function(){
		return curry.apply(this,concat([f,args],arguments));
	};
}

function once(f)
{
	var called=false;
	return function(){
		if(called) return;
		return f.apply(this,slice(arguments));
	};
}

function partial(f)
{
	var args=slice(arguments,1);
	return function(){
		return f.apply(this,concat(args,arguments));
	};
}
function partialRight(f)
{
	var args=slice(arguments,1);
	return function(){
		return f.apply(this,concat(arguments,args));
	};
}

function wrap(f,wrapper)
{
	return partial(wrapper,f);
}

function delay(f,time)
{
	var args=slice(arguments,2);
	var g=function(){
		return f.apply(null,args);
	};
	if(time===0)
		return setImmediate(g);
	return setTimeout(g,time);
}

function compose()
{
	var args=arguments;
	return function(result){
		var self=this;
		eachRight(args,function(f){
			result=f.call(self,result);
		});
		return result;
	};
}

function memoize(f)
{
	var cache=[];
	function memoized(arg)
	{
		if(hasOwn(cache,arg))
			return cache[arg];
		log('caching:',arg);
		return cache[arg]=f(arg);
	}
	memoized.cache=cache;
	return memoized;
}

function limit(f,time)
{
	var last_time=0;
	return function(){
		var n=now();
		if(n-last_time<time)
			return;
		last_time=n;
		return f.apply(this,slice(arguments));
	};
}

function now()
{
	var performance=window.performance;
	return performance?performance.now()|0:Date.now();
}

function times(n,f)
{
	var i=-1;
	while(++i<n) f(i);
}

function random(min,max,floating)
{
	if(arguments.length===0) return Math.random();
	if(floating===_undefined)
		floating=arguments.length===1?(typeof(min)==='boolean' && min):(typeof(max)==='boolean' && max);
	if(max===_undefined || typeof(max)==='boolean')
	{
		max=+min||1;
		min=0;
	}
	min=min||0;
	var seed=Math.random()*(max-min)+min;
	return (floating || min%0 || max%0)?seed:Math.floor(seed);
}

function swap(obj,key1,key2)
{
	var temp=obj[key1];
	obj[key1]=obj[key2];
	obj[key2]=temp;
}


factotum.substr=substr;
factotum.ljust=ljust;
factotum.rjust=rjust;
factotum.center=center;
factotum.trim=trim;
factotum.reverse=reverse;
factotum.repeat=repeat;
factotum.className=className;
factotum.isArray=isArray;
factotum.isArguments=isArguments;
factotum.isIterable=isIterable;
factotum.has=hasOwn;
factotum.range=range;
factotum.unique=unique;
factotum.concat=concat;
factotum.each=each;
factotum.eachRight=eachRight;
factotum.where=where;
factotum.first=first;
factotum.last=last;
factotum.find=find;
factotum.findLast=findLast;
factotum.flatten=flatten;
factotum.reduce=reduce;
factotum.reduceRight=reduceRight;
factotum.index=index;
factotum.group=group;
factotum.count=count;
factotum.slice=slice;
factotum.invoke=invoke;
factotum.map=map;
factotum.pluck=pluck;
factotum.copy=copy;
factotum.copyDeep=function(obj,getter,self){
	return copy(obj,true,getter,self);
};
factotum.invert=invert;
factotum.pairs=pairs;
factotum.bind=bind;
factotum.bindKey=bindKey;
factotum.once=once;
factotum.wrap=wrap;
factotum.delay=delay;
factotum.compose=compose;
factotum.merge=merge;
factotum.curry=curry;
factotum.yCombinator=Y;
factotum.memoize=memoize;
factotum.partial=partial;
factotum.partialRight=partialRight;
factotum.limit=limit;
factotum.tap=function(value,f){
	f(value);
	return value;
};
factotum.now=now;
factotum.times=times;
factotum.random=random;
factotum.coinFlip=function(){return random(0,2,false);};
factotum.randomize=function(arr){
	var r=[];
	var temp=slice(arr);
	while(temp.length>0)
	{
		var i=random(0,temp.length,false);
		r.push(temp[i]);
		temp.splice(i,1);
	}
	return r;
};
factotum.se={
	swap:swap
};

factotum.util={
	falsef:function(){return false;},
	truef:function(){return true;},
	emptyf:function(){},
	valuef:valueFunction,
	valueTest:valueTest,
	plucker:pluckFunction,
	identity:identityFunction
};

each(factotum,function(f,name){
	if(typeof(f)!=='function') return;
	Chain.prototype[name]=function(){
		this.value=f.apply(this,concat([this.value],arguments));
		return this;
	};
});


function $class(f)
{
	if(!(this instanceof $class))
		return new $class(f);
	this.value=f;
}

function _extends(new_class,_class,name)
{
	function new_proto(){}
	new_proto.prototype=_class.prototype;
	new_class.prototype=new new_proto();
	name=name||_class.name;
	if(!!name)
		new_class.prototype[name]=function(){
			_class.apply(new_class,slice(arguments));
		};
	return new_class;
}

function _methods(_class,methods)
{
	var self=_class;
	var proto=_class.prototype;
	each(methods,function(f,name){
		if(typeof(f)==='object')
			createProperty(proto,name,f);
		else
			addFunction(self,name,f);
	});
	return _class;
}

$class.extends=_extends;
$class.methods=_methods;
factotum.$class=$class;

each($class,function(f,name){
	$class.prototype[name]=function(){
		this.value=f.apply(this,concat([this.value],arguments));
		return this;
	};
});


function promiseCallback(f,p)
{
	return function(value){
		try{
			p.resolve(f(value));
		}
		catch(error){
			p.reject(error);
			if(p.rethrow)
				throw error;
		}
	};
}

function promise(f,rethrow)
{
	this.state='pending';
	this.__success__=[];
	this.__error__=[];
	if(typeof(f)==='boolean')
		this.rethrow=f;
	else
		this.rethrow=!!rethrow;
	
	if(typeof(f)==='function')
		f(bind(this.resolve,this),bind(this.reject,this));
}
$class(promise).
	methods({
		then:function(good,bad){
			var p=new promise(this.rethrow);
			if(good) good=promiseCallback(good,p);
			if(bad) bad=promiseCallback(bad,p);
			
			if(this.state==='success' && good) good(this.value);
			if(this.state==='failure' && bad) bad(this.value);
			if(this.state==='pending')
			{
				if(good) this.__success__.push(good);
				if(bad) this.__error__.push(bad);
			}
			return p;
		},
		success:function(f){
			return this.then(f,null);
		},
		'catch':function(f){
			return this.then(null,f);
		},
		resolve:function(value){
			if(this.state!=='pending') return;
			this.state='success';
			this.value=value;
			arrayEach(this.__success__,function(f){
				delay(f,0,value);
			});
			return this;
		},
		reject:function(value){
			if(this.state!=='pending') return;
			this.state='failure';
			this.value=value;
			arrayEach(this.__error__,function(f){
				delay(f,0,value);
			});
			return this;
		},
		fulfilled:{
			get:function(){
				return this.state==='success';
			}
		},
		rejected:{
			get:function(){
				return this.state==='failure';
			}
		},
		pending:{
			get:function(){
				return this.state==='pending';
			}
		}
	});
makeGlobal(promise);


var storage={
	save:function(name,data){
		localStorage[name]=JSON.stringify(data);
	},
	saveSession:function(name,data){
		sessionStorage[name]=JSON.stringify(data);
	},
	load:function(name,defaultValue){
		var temp=localStorage[name];
		return (temp===undefined)?defaultValue:JSON.parse(temp);
	},
	loadSession:function(name,defaultValue){
		var temp=sessionStorage[name];
		return (temp===undefined)?defaultValue:JSON.parse(temp);
	},
	remove:function(name){
		if(name in localStorage)
			delete localStorage[name];
	},
	removeSession:function(name){
		if(name in sessionStorage)
			delete sessionStorage[name];
	}
};
makeGlobal(storage,"Storage");


var formats={
	number:function(value,size){
		if(size) return rjust(value+"",+size);
		return value+"";
	},
	exp:function(value,size){
		value=(+value).toExponential();
		if(size) return rjust(value,+size);
		return value;
	},
	EXP:function(value,size){
		value=(+value).toExponential().toUpperCase();
		if(size) return rjust(value,+size);
		return value;
	},
	hex:function(value,size){
		value=value.toString(16);
		if(size) return rjust(value,+size);
		return value;
	},
	HEX:function(value,size){
		value=value.toString(16).toUpperCase();
		if(size) return rjust(value,+size);
		return value;
	},
	binary:function(value,size){
		value=value.toString(2);
		if(size) return rjust(value,+size);
		return value;
	},
	string:function(value,f,space,pattern){
		value+="";
		if(!f) return value;
		return factotum[f](value,+space,pattern);
	},
	json:function(value){
		return JSON.stringify(value);
	},
	url:function(value){
		return encodeURIComponent(value+"");
	},
	call:function(value,func){
		log(slice(arguments,2));
		return value[func].apply(value,slice(arguments,2));
	}
};
function sprintf(str)
{
	var args=slice(arguments,1);
	return str.replace(/\%\%|\%\{[^\}]+\}/g,function(s){
		if(s==="%%") return "%";
		
		var form=s.substr(2,s.length-3).split('/');
		var prop=form[0].split(".");
		var value=args;
		for(var x=0;x<prop.length;x++)
			value=value[prop[x]];
		if(form.length>1)
		{
			var fargs=form[1].split(' ');
			var fmat=fargs.shift();
			return formats[fmat].apply(null,concat([value],fargs));
		}
		return value;
	});
}
sprintf.addFormat=function(name,func){
	formats[name]=func;
};
makeGlobal(sprintf);


var base64_symbols=[];
for(var temp='A'.charCodeAt(0);temp<='Z'.charCodeAt(0);temp++)
	base64_symbols.push(String.fromCharCode(temp));
for(var temp='a'.charCodeAt(0);temp<='z'.charCodeAt(0);temp++)
	base64_symbols.push(String.fromCharCode(temp));
for(var temp='0'.charCodeAt(0);temp<='9'.charCodeAt(0);temp++)
	base64_symbols.push(String.fromCharCode(temp));
base64_symbols.push('+','/');
var base64_values=merge({'=':0},invert(base64_symbols));
function base64_encode(str)
{
	var pieces=[];
	for(var x=0, len=str.length;x<len;x+=3)
		pieces.push(str.substr(x,3));
	for(var x=0, len=pieces.length;x<len;x++)
	{
		var p=pieces[x];
		var src=p.charCodeAt(0)<<16 | (p.charCodeAt(1)||0)<<8 | (p.charCodeAt(2)||0);
		var dest="";
		dest+=base64_symbols[(src&(0x3F<<18))>>18];
		dest+=base64_symbols[(src&(0x3F<<12))>>12];
		dest+=p.length>1?base64_symbols[(src&(0x3F<<6))>>6]:'=';
		dest+=p.length===3?base64_symbols[src&0x3F]:'=';
		pieces[x]=dest;
	}
	return pieces.join("");
}
function base64_decode(str)
{
	var pieces=[];
	var len=str.length;
	str=str+"=".repeat(str.length%4);
	for(var x=0;x<len;x+=4)
		pieces.push(str.substr(x,4));
	for(var x=0, len=pieces.length;x<len;x++)
	{
		var p=pieces[x];
		var src=(base64_values[p.charAt(0)]<<18)|
				(base64_values[p.charAt(1)]<<12)|
				(base64_values[p.charAt(2)]<<6)|
				base64_values[p.charAt(3)];
		var dest="";
		dest+=String.fromCharCode((src&(0xFF<<16))>>16);
		dest+=String.fromCharCode((src&(0xFF<<8))>>8);
		dest+=String.fromCharCode(src&0xFF);
		pieces[x]=dest;
	}
	return pieces.join("");
}


var hex_symbols=['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
var hex_values=invert(hex_symbols);
function hex_encode(str)
{
	var dest=[];
	str.each(function(ch){
		ch=ch.charCodeAt(0);
		dest.push(hex_symbols[(ch&0xF0)>>4]+hex_symbols[ch&0x0F]);
	});
	return dest.join("");
}
function hex_decode(str)
{
	var dest=[];
	for(var x=0, len=str.length;x<len;x+=2)
		dest.push(String.fromCharCode((hex_values[str.charAt(x)]<<4)+hex_values[str.charAt(x+1)]));
	return dest.join("");
}

function post_encode(obj,name)
{
	name=name||null;
	if(typeof(obj)==='object')
	{
		var r=[];
		if(typeof(obj.length)==='number')
		{
			var index=-1, len=obj.length;
			while(++index<len)
				r.push(post_encode(obj[index],sprintf("%{0}[%{1}]",name,index)));
		}
		else
		{
			var null_name=(name===null);
			for(var key in obj)
			{
				if(!hasOwn(obj,key)) continue;
				temp=null_name?key:sprintf("%{0}[%{1}]",temp,key);
				r.push(post_encode(obj[key],temp));
			}
		}
		return r.join("&");
	}
	return sprintf("%{0}=%{1/string}",name,obj);
}


makeGlobal({
	base64:base64_encode,
	json:JSON.stringify,
	hex:hex_encode,
	postData:post_encode
},"Encode");
makeGlobal({
	base64:base64_decode,
	json:JSON.parse,
	hex:hex_decode
},"Decode");


function compileTemplate(template,settings,data)
{
	"use strict";
	settings=merge({},compileTemplate.settings,settings||{});
	var before_template="\");\n";
	var after_template="r.push(\"";
	template="r.push($3"+template+"$3);";
	var code=template.
		replace(/\\n/g,"$2").replace(/\r?\n/g,"$1").replace(/\"/g,"\\\"").
		replace(/\{\%\s*for ([\w\$][\w\d\$]*) (\d+)\-\>(\d+)\s*\%\}/g,function(loop,name,start,end){
			return before_template+
					sprintf("var %{2}=%{0};\nwhile(++%{2}<%{1}){\n",(+start)-1,end,name)+
					after_template;
		}).
		replace(/\{\%\s*if (.+?)\s*\%\}/g,function(s,condition){
			return before_template+
					sprintf("if(%{0}){\n",condition)+
					after_template;
		}).
		replace(/\{\%\s*else\s*\%\}/g,function(s){
			return before_template+
					"else{\n"+
					after_template;
		}).
		replace(/\{\%\s*elseif (.+?)\s*\%\}/g,function(s,condition){
			return before_template+
					sprintf("else if(%{0}){\n",condition)+
					after_template;
		}).
		replace(/\{\%\s*for (\w[\w\d]*)\s+in\s+([\w\$][\w\d\$\.]*)\s*\%\}/g,function(s,variable,array){
			return before_template+
					sprintf("var $index=-1, $end=%{0}.length;\nwhile(++$index<$end){\nvar %{1}=%{0}[$index];\n",array,variable)+
					after_template;
		}).
		replace(/\{\%\s*for (\w[\w\d]*)?:(\w[\w\d]*) in ([\w\$][\w\d\$\.]*)\s*\%\}/g,function(s,keyName,valueName,obj){
			return before_template+
					sprintf("for(var %{0} in %{2}){\nif(!%{2}.hasOwnProperty(%{0})) continue;\nvar %{1}=%{2}[%{0}];\n",keyName||"key_"+valueName,valueName,obj)+
					after_template;
		}).
		replace(/\{\%:\s*(.*?)\s*\%\}/g,function(s,code){
			return before_template+"r.push("+code.replace(/\\\"/g,'"')+");\n"+after_template;
		}).
		replace(/\{\%\s*\/(for|if)\s*\%\}/g,before_template+"}\n"+after_template).
		replace(/\{\%\@(\s|\$1)+(.*?)\s*\%\}/gm,function(s,space,code){
			return before_template+code.replace(/\\\"/g,'"')+"\n"+after_template;
		}).
		replace(/\{\%\%/g,"{%").replace(/\%\%\}/g,"%}").
		replace(/\$3/g,'"').
		replace(/r\.push\(""\);\n?/g,"").
		replace(/r\.push\("(.+?[^\\])?"\)/g,function(s){
			return s.replace(/\$1/g,"\\n");
		}).
		replace(/\$2/g,"\\n").replace(/\$1/g,"\n");
	code="function print(){var index=-1, len=arguments.length; while(++index<len){r.push(arguments[index]);}}\nvar echo=print, \
puts=print, cout=print;\nvar r=[];\n"+code+"\nreturn r.join('');";
	try{
		var f=new Function(settings.dataName,code);
	}
	catch(e){
		var depth=1;
		code=map(code.split('\n'),function(line){
			if(last(line)==="}" && depth>1)
				depth--;
			line=repeat('\t',depth)+trim(line);
			if(last(line)==="{")
				depth++;
			return line;
		}).join('\n');
		//log(code);/**/
		puts("error compiling:",code);
		return null;
	}
	f.source=code;
	return data?f(data):f;
}
compileTemplate.settings={
	dataName:"$data"
};

factotum.template=compileTemplate;

function ajax(url,postData,async,callback)
{
	var request=new XMLHttpRequest();
	var p=new promise();
	request.addEventListener('load',function(event){
		var result={requestObject:request};
		result.statusCode=request.status;
		result.statusText=request.statusText;
		result.success=(request.status>=200 && request.status<300);
		if(callback) setImmediate(bind(callback,null,request));
		if(result.success)
			p.resolve(request);
		else
		{
			var error=new Error(sprintf("Error code %{0} returned by server",result.statusCode));
			error.result=result;
			error.name="BadRequest";
			p.reject(error);
		}
	});
	var method=postData?"POST":"GET";
	try{
		request.open(method,url,async!==false);
		request.send(postData||null);
	}
	catch(err){
		p.reject(err);
	}
	return p;
}
factotum.ajax=ajax;


function instanceOf(obj,_class)
{
	return (obj instanceof _class) || obj.constructor===_class;
}
factotum.instanceOf=instanceOf;


if(has_window)
{
	var DOMReadyPromise=new promise(true);
	var domreadysetup=function(){
		if(!document.body)
		{
			setImmediate(domreadysetup);
			return;
		}
		var e=document.createElement("div");
		e.style.position='absolute';
		e.style.width='1in';
		e.style.left='-2in';
		document.body.appendChild(e);
		window.screen.dpi=e.offsetWidth;
		document.body.removeChild(e);
		DOMReadyPromise.resolve(document);
		window.removeEventListener("message",domreadysetup);
	}
	window.addEventListener("message",domreadysetup,false);
	window.postMessage([],"*");
	makeGlobal(DOMReadyPromise,"domready");
}


if(typeof(exports)!=='undefined')
	exports=factotum;

if(has_global)
	__global__.F=factotum;
if(has_window)
	__window__.F=factotum;

})();
