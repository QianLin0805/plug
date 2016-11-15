//Javascript Document
var $ = function(elems){
	return new Base(elems);
}
function Base(elems){
	this.elements = [];
	this.getId = function(id){
		this.elements.push(document.getElementById(id));
	}
	this.getClass = function(name){
		var nodes = document.getElementsByTagName('*');
		for(var i=0;i<nodes.length;i++){
			if(nodes[i].className == name){
				this.elements.push(nodes[i]);
			}
		}
	}
	this.getTag = function(tag){
		var tags = document.getElementsByTagName(tag)
		for(var i=0;i<tags.length;i++){
			this.elements.push(tags[i]);
		}
	}
	if(typeof elems == 'string'){
		if(elems.indexOf(' ')==-1){
			switch(elems.charAt(0)){
				case '#':
					this.getId(elems.substring(1));
					break;
				case ".":
					this.getClass(elems.substring(1));
					break;
				default :
					this.getTag(elems);
			}
		}else{
			var level = elems.split(' ');
			var childNodes;                                        //存放临时节点
			var parentNodes = [];                                  //存放临时父节点
			for(var i=0;i<level.length;i++){
				childNodes = [];
				if(parentNodes.length == 0) parentNodes[0] = document;
				switch(level[i].charAt(0)){
					case '#':
						childNodes.push(document.getElementById(level[i].substring(1)));
						parentNodes = childNodes;
						break;
					case ".":
						for(var j=0;j<parentNodes.length;j++){
							var children = parentNodes[j].getElementsByTagName('*');
							for(var k=0;k<children.length;k++){
								if(children[k].className == level[i].substring(1)){
									childNodes.push(children[k]);
								}
							}
						}
						parentNodes = childNodes;
						break;
					default :
						for(var j=0;j<parentNodes.length;j++){
							var children = parentNodes[j].getElementsByTagName(level[i]);
							for(var k=0;k<children.length;k++){
								childNodes.push(children[k]);
							}
						}
						parentNodes = childNodes;
				}
			}
			this.elements = childNodes;
		}
	}else if(typeof elems == 'object'){                   //$(this)
		if(elems!=undefined){
			this.elements[0] = elems;
		}
	}
	this.length = this.elements.length;
}

function evObj(event){                                    //兼容ie event事件
	event.preventDefault = function(){
		this.returnValue = false;
	}
	event.stopPropagation = function(){
		this.cancelBubble = true;
	}
	return event;
}

Base.prototype.find = function(str){
	var childNodes = [];
	for(var i=0;i<this.elements.length;i++){
		switch(str.charAt(0)){
			case '#':
				childNodes.push(document.getElementById(str.substring(1)));
				break;
			case '.':
				var child = this.elements[i].getElementsByTagName('*');
				for(var j=0;j<child.length;j++){
					if(child[j].className == str.substring(1)){
						childNodes.push(child[j]);
					}
				}
				break;
			default :
				var child = this.elements[i].getElementsByTagName(str);
				for(var j=0;j<child.length;j++){
					childNodes.push(child[j]);
				}
		}
	}
	this.elements = childNodes;
	return this;
}

Base.prototype.eq = function(num){
	var element = this.elements[num];
	this.elements = [];
	this.elements[0] = element;
	return this;
}
Base.prototype.width = function(){
	for(var i=0;i<this.elements.length;i++){
		return this.elements[i].clientWidth + 'px';
	}
}
Base.prototype.height = function(){
	for(var i=0;i<this.elements.length;i++){
		return this.elements[i].clientHeight + 'px';
	}
}
Base.prototype.html = function(str){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length == 0){
			return this.elements[i].innerHTML;
		}else if(arguments.length == 1){
			this.elements[i].innerHTML = str;
		}
	}
}
Base.prototype.offset = function(){
	for(var i=0;i<this.elements.length;i++){
		return {
			left: this.elements[i].offsetLeft,
			top: this.elements[i].offsetTop
		}
	}
}
Base.prototype.first = function(){
	return this.elements[0];
}
Base.prototype.last = function(){
	return this.elements[this.elements.length - 1];
}

function getStyle(obj,attr){                                                     //获取样式
	if(window.getComputedStyle){
		return window.getComputedStyle(obj,null)[attr];
	}else if(obj.currentStyle){     
		return obj.currentStyle[attr];
	}
}
Base.prototype.css = function(attr,value){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==1&&typeof arguments[0]!="object"){                  //只带一个参数时改为获取
			return getStyle(this.elements[i],attr);
		}else if(arguments.length==1&&typeof arguments[0]=="object"){            //只带一个参数时改为获取
			for(var x in attr){
				this.elements[i].style[x] = attr[x];
			}
		}else{
			this.elements[i].style[attr] = value;
		}
	}
	return this;
}
function getOldDisplay(obj){
	var tag = obj.tagName.toLowerCase();
	var tagEl = document.createElement(tag);
	document.body.appendChild(tagEl);
	var oldDisplay = getStyle(tagEl,'display');
	document.body.removeChild(tagEl);
	return oldDisplay;
}
Base.prototype.show = function(){
	for(var i=0;i<this.elements.length;i++){
		var defaultDisplay = getOldDisplay(this.elements[i]);
		this.elements[i].style.display = defaultDisplay;
	}
	return this;
}
Base.prototype.hide = function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display = 'none';
	}
	return this;
}
Base.prototype.addClass = function(str){
	for(var i=0;i<this.elements.length;i++){
		if(!this.elements[i].className.match(new RegExp('(\\s|^)'+str+'(\\s|$)'))){
			this.elements[i].className += ' '+str;
		}
	}
	return this;
}
Base.prototype.removeClass = function(str){
	for(var i=0;i<this.elements.length;i++){
		if(this.elements[i].className.match(new RegExp('(\\s|^)'+str+'(\\s|$)'))){
			this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)'+str+'(\\s|$)'),' ');
		}
	}
	return this;
}

function addEvent(obj,type,fn){
	function match(arr,fn){
		for(var i=0;i<arr.length;i++){
			if(arr[i] == fn) return true;
			return false;
		}
	}
	if(window.addEventListener != undefined){
		obj.addEventListener(type,fn,false);
	}else{
		if(!obj.events) obj.events = {};
		if(!obj.events[type]){
			obj.events[type] = [];
			if(arguments.length<3) return false;
			obj.events[type][0] = fn;
		}else{
			if(match(obj.events[type],fn)) return false;
			obj.events[type][obj.events[type].length+1] = fn;
		}
		obj['on'+type] = function(event){
			var event = event || evObj(window.event);
			for(var i in this.events[event.type]){
				this.events[event.type][i].call(this,event);
			}
		};
	}
}
function removeEvent(obj,type,fn){
	if(arguments.length >= 3){
		if(window.removeEventListener != undefined){
			obj.removeEventListener(type,fn,false);
		}else{
			for(var i=0;i<obj.events[type].length;i++){
				if(obj.events[type][i] == fn){
					delete obj.events[type][i];
				}
			}
		}
	}else{
		if(window.removeEventListener != undefined){
			obj.addEventListener(type,function(){ return false },false);
		}else{
			delete obj.events[type];
		}
	}
}
Base.prototype.bind = function(str,fn){
	var events = str.split(' ');
	for(var i=0;i<this.elements.length;i++){
		for(var j=0;j<events.length;j++){
			if(arguments.length>=2){
				addEvent(this.elements[i],events[j],fn);
			}else{
				addEvent(this.elements[i],events[j]);
			}
		}
	}
	return this;
}
Base.prototype.unbind = function(str,fn){
	var events = str.split(' ');
	for(var i=0;i<this.elements.length;i++){
		for(var j=0;j<events.length;j++){
			if(arguments.length>=2){
				removeEvent(this.elements[i],events[j],fn);
			}else{
				removeEvent(this.elements[i],events[j]);
			}
		}
	}
	return this;
}

Base.prototype.click = function(fn){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].onclick = fn;
	}
}
Base.prototype.mousedown = function(fn){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].onmousedown = fn;
	}
}
