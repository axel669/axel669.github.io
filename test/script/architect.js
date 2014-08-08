(function(window){

var requestFrame=null, cancelFrame=null;
function emptyf(){}
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
function bind(method,self)
{
	var args=slice(arguments,2);
	return function(){
		return method.apply(self,concat(args,arguments));
	};
}

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
requestFrame=bind(requestFrame,window);
var tag=document.querySelectorAll("script");
tag=tag[tag.length-1];
if(tag.getAttribute("data-expose-frames")==="true")
	window.requestFrame=requestFrame;


function execSandboxed(tag,args)
{
	if(typeof(tag)==='string')
		tag=document.querySelector(tag);
	var script='"use strict";'+tag.innerHTML;
	args=args||{};
	argNames=Object.keys(args);
	var argList=[];
	for(var x=0;x<argNames.length;++x)
		argList.push(args[argNames[x]]);
	try{
		var f=new Function(argNames,script);
		f.apply(null,argList);
	}
	catch(e){
		log("Error in sandbox: "+(tag.getAttribute("data-sandbox")||"<unnamed>"));
		throw e;
	}
}

var layoutVars={};



function parseAnchor(anchor)
{
	var parserRegex=/(\w+)\[(\w+):(\-?\d+)(\s+(\w+):(\-?\d+))?(\s+(\w+):(\-?\d+))?(\s+(\w+):(\-?\d+))?\]/g;
	var info={
		'top-anchor':0,
		'left-anchor':0,
		'right-anchor':0,
		'bottom-anchor':0,
		'top-offset':0,
		'left-offset':0,
		'right-offset':0,
		'bottom-offset':0
	};
	var match=null;
	var pos=0;
	do
	{
		parserRegex.lastIndex=pos;
		match=parserRegex.exec(anchor);
		if(match!==null)
		{
			pos=match.index+match[0].length;
			for(var x=2;match[x];x+=3)
				info[match[x]+'-'+match[1]]=+match[x+1];
		}
	}while(match!==null);
	if(info.hasOwnProperty('width-size'))
	{
		info['right-anchor']=info['left-anchor'];
		info['right-offset']=-(info['width-size']+info['left-offset']);
	}
	if(info.hasOwnProperty('height-size'))
	{
		info['bottom-anchor']=info['top-anchor'];
		info['bottom-offset']=-(info['height-size']+info['top-offset']);
	}
	return info;
}

var codeBase="var left=(({left-anchor}/100)*rect.width+({left-offset}))+'px';\n"+
"var right=rect.width-(({right-anchor}/100)*rect.width-({right-offset}))+'px';\n"+
"var top=(({top-anchor}/100)*rect.height+({top-offset}))+'px';\n"+
"var bottom=rect.height-(({bottom-anchor}/100)*rect.height-({bottom-offset}))+'px';\n"+
"if(style.left!==left) style.left=left;\n"+
"if(style.right!==right) style.right=right;\n"+
"if(style.bottom!==bottom) style.bottom=bottom;\n"+
"if(style.top!==top) style.top=top;";
function compileAnchor(elem,layoutVars)
{
	var anchorText=elem.getAttribute("data-layout");
	anchorText=anchorText.replace(/\{([a-zA-Z_\$](\w|\$)*?)\}/g,function(s,name){
		return layoutVars[name];
	});
	var info=parseAnchor(anchorText);
	var codez=codeBase.replace(/\{([\w\-]+)\}/g,function(s,name){
		return info[name];
	});
	var f=new Function("rect","style",codez);
	f.source=codez;
	elem.__layout__=f;
	
	var styleCheck=getComputedStyle(elem);
	if(styleCheck.position!=='absolute')
		elem.style.position='absolute';
}

function reflow()
{
	requestFrame(reflow);
	var elements=document.querySelectorAll("*[data-layout]");
	for(var x=0, end=elements.length;x<end;++x)
	{
		var elem=elements[x];
		if(!elem.hasOwnProperty("__layout__"))
			compileAnchor(elem,layoutVars);
		var parent=elem.parentNode;
		elem.__layout__({width:parent.clientWidth,height:parent.clientHeight},elem.style);
	}
}

var message=Math.random();
function domReadySetup(e)
{
	if(!document.body)
	{
		window.postMessage(message,"*");
		return;
	}
	if(+e.data!==message)
		return;
	window.removeEventListener("message",domReadySetup);
	
	requestFrame(reflow);
	
	var elems=document.querySelectorAll("*[data-name]");
	var elements={};
	for(var x=0, end=elems.length;x<end;++x)
	{
		var elem=elems[x];
		elements[elem.getAttribute("data-name")]=elem;
	}
	
	var sandboxes=document.querySelectorAll("script[type='sandbox-js']");
	for(var x=0, end=sandboxes.length;x<end;++x)
		execSandboxed(sandboxes[x],elements);
}
window.addEventListener("message",domReadySetup);
window.postMessage(message,"*");

})(window);
