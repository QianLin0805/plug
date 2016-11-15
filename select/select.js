/*Copyright (c) 2016 Jerry_Qiu
 *
 */
;(function(window){
    function select(items) {
        this.mainWrap = document.getElementById('select-wrap');
        if(!(items instanceof Array)) return;
        this.init(items);
    };
    select.prototype = {
        init: function(items) {
            this.appendList(items);
            this.selectEvent(items);
        },
        appendList: function(items){
            this.eventEl = document.createElement('p');
            this.eventEl.innerHTML = items[0];
            this.mainWrap.appendChild(this.eventEl);

            var arrow = document.createElement('span');
            this.mainWrap.appendChild(arrow);

            this.listBox = document.createElement('div');
            this.mainWrap.appendChild(this.listBox);

            this.ulList = document.createElement('ul');
            this.listBox.appendChild(this.ulList);

            for(var i=0;i<items.length;i++){
                var item = document.createElement('li');
                item.innerHTML = items[i];
                this.ulList.appendChild(item);
            }
        },
        selectEvent: function(items){
            var wrap = this.mainWrap;
            var listBox = this.listBox;
            var eventEl = this.eventEl;
            var ulList = this.ulList;

            var offsetTop = this.mainWrap.offsetTop + 50;
            var pg = window.innerHeight || document.documentElement.clientHeight;

            function getdisplay(obj){
                if(window.getComputedStyle){
                    return window.getComputedStyle(obj,null)['display'];
                }else if(obj.currentStyle){     
                    return obj.currentStyle['display'];
                }
            }

            this.eventEl.onclick = function(){
                display = getdisplay(listBox);
                if(display == 'none'){
                    if(pg - offsetTop < 155){
                        listBox.setAttribute('class','up');
                    }else{
                        listBox.setAttribute('class','down');
                    }
                    listBox.style.display = 'block';
                }else{
                    listBox.style.display = 'none';
                }
            }
            document.onclick = function(e){
                var e = e || window.event;
                var target = e.target || e.srcElement;
                var el = wrap.getElementsByTagName('*');
                for(var i=0;i<el.length;i++){
                    if(el[i] == target) return;
                }
                listBox.style.display = 'none';
            }
            var item = this.ulList.getElementsByTagName('li');
            for(var i=0;i<item.length;i++){
                var that = item[i]
                item[i].onclick = (function(i){
                    var text = that.innerHTML;
                    return function(){
                        eventEl.innerHTML = text;
                        listBox.style.display = 'none';
                    }
                })(i)
            }
        }
    };
    window.select = select;
})(window);
