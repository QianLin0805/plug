/*Copyright (c) 2016 Jerry_Qiu
  
  属性  tip,confirm     设置弹窗类型
   
  参数  type            设置弹窗类型
        content         提示内容或标题
        bg              设置弹窗背景色
        delay           提示持续存在的时间
        fadeTime        提示渐隐持续时间
        width           提示窗口宽度
        width           提示窗口高度
        callback        回调函数，弹窗关闭后执行
        
*/
;(function(window){
	var flag = false;                                  //作为防止两个弹窗的标志
	function inarr(arr,str){                           //判断数组中是否存在str
		for(var i=0;i<arr.length;i++){
			if(str === arr[i]) return true;
		}
		return false;
	}
	function getOpacity(obj){                          //获取样式
		if(window.getComputedStyle){
			return window.getComputedStyle(obj,null).opacity;
		}else if(obj.currentStyle){
			return obj.currentStyle.filter ? obj.currentStyle.filter : 1;
		}
	}
	function fade(el,t,fn){
		var timer;
		var time = (!isNaN(t)) ? t : 200;
		var opacity = parseFloat(getOpacity(el));
		var d = Math.round((30 * opacity / time) * 10000);
		timer = setInterval(function(){
			if(window.getComputedStyle){
				opacity = (opacity * 10000 - d)/10000;
				el.style.opacity = opacity;
			}else if(el.currentStyle){
				opacity = (opacity * 10000 - d)/100;
				el.style.filter = 'alpha(opacity = ' + opacity + ')';
			}
			if(opacity <= 0){
				if(window.getComputedStyle){
					el.style.opacity = 0;
				}else if(el.currentStyle){
					el.style.filter = 'alpha(opacity = 0)';
				}
				clearInterval(timer);
			}
		},30);

		var times = Math.round(time/30);
		var callback = (typeof t == 'function') ? t : (typeof fn == 'function') ? fn : '';
		if(callback){
			setTimeout(callback,times*30);
		}
	}

	function pop(params){
		var setting = {
			type: "tip",
			content: "操作成功",
			bg: "black",
			delay: 1000,
			fadeTime: 200,
			width: '',
			height: '',
			callback: ''
		}
		if(!params) return new popTip(setting);           //未设定参数时
		var arr = [];
		for(x in params){
			arr.push(x);
		}
		if(params.type && params.type == 'confirm') setting.content = '是否确定要执行此操作';
		for(x in setting){                                //对未被设定的部分参数初始化
			if(!inarr(arr,x)) params[x] = setting[x];
		}
		return new popTip(params);
	}

	function popTip(params){
		this.init(params);
	}
	popTip.prototype = {
		init : function(params){
			if(flag == true) return;                      //防止两个弹窗
			flag = true;
			var arr = [];
			for(x in this.create){
				arr.push(x);
			}
			if(!inarr(arr,params.type)){

				return;
			}
			this.create[params.type](params);
		},
		create : {
			tip: function(params){
				var body = document.body;
				var popBox = document.createElement('div');
				popBox.id = 'pop-tip';
				popBox.innerHTML = '<p class="bg"></p><span>'+ params.content +'</span>';

				body.appendChild(popBox);

				var bg = popBox.getElementsByTagName('p')[0];
				if(params.bg != ('black' || '#000')) bg.style.background = params.bg;

				popBox.style.display = 'block';
				var width,height;
				params.width ? width = parseFloat(params.width) : width = popBox.scrollWidth;
				params.height ? height = parseFloat(params.height) : height = popBox.scrollHeight;
				if(params.width) popBox.style.width = width + 'px';
				if(params.height) popBox.style.height = height + 'px';
				popBox.style.marginLeft = -width/2 + 'px';
				popBox.style.marginTop = -height/2 + 'px';

				setTimeout(function(){
					fade(popBox,function(){
						body.removeChild(popBox);
						flag = false;
					});
				},params.delay);
			},
			confirm: function(params){
				var body = document.body;
				var popWrap = document.createElement('div');
				popWrap.setAttribute('class','pop-wrap');
				popWrap.innerHTML = '<p class="bg"></p><div class="pop-box"><p class="title">'+ params.content +'</p><div class="pop-btn"><p id="pop-sure">确认</p><p id="pop-cancel">取消</p></div></div>';

				body.appendChild(popWrap);

				var bg = popWrap.getElementsByTagName('p')[0];
				if(params.bg != ('black' || '#000')) bg.style.background = params.bg;

				popWrap.style.display = 'block';
				var width,height;
				var popBox = popWrap.getElementsByTagName('div')[0];
				params.width ? width = parseFloat(params.width) : width = popBox.scrollWidth;
				params.height ? height = parseFloat(params.height) : height = popBox.scrollHeight;
				if(params.width) popBox.style.width = width + 'px';
				if(params.height) popBox.style.height = height + 'px';
				popBox.style.marginLeft = -width/2 + 'px';
				popBox.style.marginTop = -height/2 + 'px';

				var btnSure = document.getElementById('pop-sure');
				var btnCancel = document.getElementById('pop-cancel');
				btnSure.onclick = function(){
					fade(popWrap,function(){
						body.removeChild(popWrap);
						flag = false;
						if(typeof params.callback == 'function') params.callback();
					});
				}
				btnCancel.onclick = function(){
					fade(popWrap,function(){
						body.removeChild(popWrap);
						flag = false;
					});
				}
			}
		}
	}
	window.pop = pop;
})(window);