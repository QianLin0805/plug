/*Copyright (c) 2016 Jerry_Qiu
 *id        form-test   包裹节点
            form-sub    提交按钮
 *class     form-item   单个表单父类
 *属性      category    错误提示时自定义类目名
 */
;(function($,window){
    var keyWords = 'input[type="text"],input[type="password"],input[type="tel"],input[type="email"],input[type="radio"],input[type="checkbox"],select,textarea';
    var testItem = $('#form-test').find(keyWords);           //所有表单元素
    var reqItem = (function(){                               //必填项
        var arr = [];
        for(var i=0;i<testItem.length;i++){
            var type = testItem.eq(i).attr('type');
            var tagname = testItem.eq(i)[0].tagName;
            var req = testItem.eq(i).attr('required') ? true : false;
            if( type == ('checkbox' || 'radio') || tagname == 'select' ) continue;
            if( req ) arr.push(testItem.eq(i));
        }
        return arr;
    })();

    var allowCode = (function(){                              //keydown事件允许键的值
        var arr = [];
        arr.push(8);
        arr.push(13);
        arr.push(46);
        for(var i=48;i<=57;i++){
            arr.push(i);
        }
        for(var i=65;i<=90;i++){
            arr.push(i);
        }
        for(var i=96;i<=111;i++){
            arr.push(i);
        }
        for(var i=186;i<=192;i++){
            arr.push(i);
        }
        for(var i=219;i<=222;i++){
            arr.push(i);
        }
        arr.push(229)
        return arr;
    })();
    //var intensity;                                            密码安全强度、错误提示、删除提示
    var flag;
    var reqValue = {};                                        //存储必填项的值
    var errorList = {};                                       //存储错误信息
    var errorType = {};                                       //存储错误类型

    var testSet = {
        keyup : {                                            //需要监听keyup事件的表单
            fullname: function(value){
                if(!/^[·一-龥a-zA-Z]+$/g.test(value)){
                    errorList.fullname = '姓名不合法';
                    errorType.fullname = 1;
                    return false;
                }
                return true;
            },
            username: function(value){
                if(!/^[·_一-龥a-zA-Z0-9]+$/g.test(value)){
                    var category = $('input[name="username"]').attr('category');
                        category = category ? category : '用户名';
                    errorList.username = category + '不合法';
                    errorType.username = 1;
                    return false;
                }
                return true;
            },
            password: function(value){
                if(/[\n\r\s]/g.test(value)){
                    errorList.password = '密码不能存在空格或换行符';
                    errorType.password = 1;
                    return false;
                }
                /*if(/\d/.test(value)){
                    safestatus = 1;
                    if(/[a-zA-Z]/.test(value)){
                        safestatus = 2;
                        if(/[\W_]/.test(value)){
                            safestatus = 3;
                        }
                    }
                }*/
                return true;
            },
            mobile: function(value){
                if(/[^\d]/.test(value)){
                    errorList.mobile = '手机号不合法';
                    errorType.mobile = 1;
                    return false;
                }
                return true;
            },
            email: function(value){
                if(!/[\w\.@]/.test(value)){
                    errorList.email = '邮箱不合法';
                    errorType.email = 1;
                    return false;
                }
                return true;
            },
            idCard: function(value){
                if(/[^\d && ^X]/.test(value)){
                    errorList.idCard = '身份证号不合法';
                    errorType.idCard = 1;
                    return false;
                }
                return true;
            },
            bankCard: function(value){
                if(/[^\d]/.test(value)){
                    errorList.bankCard = '银行卡号不合法';
                    errorType.bankCard = 1;
                    return false;
                }
                return true;
            }
        },
        blur : {                                             //需要监听blur事件的表单
            fullname: function(value){
                if(value.length < 2 ||  value.length > 30){
                    errorList.fullname = '姓名长度必须是2-30位';
                    errorType.fullname = 2;
                    return false;
                }
                return true;
            },
            username: function(value){
                if(value.length < 2 ||  value.length > 30){
                    var category = $('input[name="username"]').attr('category');
                        category = category ? category : '用户名';
                    errorList.username = category + '长度必须是2-30位';
                    errorType.username = 2;
                    return false;
                }
                return true;
            },
            password: function(value){
                if(value.length < 6 ||  value.length > 20){
                    errorList.password = '密码长度必须是6-20位';
                    errorType.password = 2;
                    return false;
                }
                return true;
            },
            repassword: function(value){
                var psd = $('input[name="password"]').val();
                if(value != psd){
                    errorList.repassword = '密码不一致';
                    errorType.repassword = 2;
                    return false;
                }
                return true;
            },
            mobile: function(value){
                if(!/^[1][34578][0-9]{9}$/.test(value)){
                    errorList.mobile = '无效的手机号';
                    errorType.mobile = 2;
                    return false;
                }
                return true;
            },
            email: function(value){
                var ptn = /^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/gi;
                if(!ptn.test(value)){
                    errorList.email = '邮箱格式不正确';
                    errorType.email = 2;
                    return false;
                }
                return true;
            },
            idCard: function(value){
                var ptn1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
                var ptn2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
                if( !(ptn1.test(value) || ptn2.test(value)) ){
                    errorList.idCard = '无效的身份证';
                    errorType.idCard = 2;
                    return false;
                }
                return true;
            },
            bankCard: function(value){
                var ptn = /^(\d{16}|\d{19})$/;
                if(!ptn.test(value)){
                    errorList.bankCard = '无效的银行卡';
                    errorType.bankCard = 2;
                    return false;
                }
                return true;
            }
        },
        keyupItem: function(){                               //需要监听keyup事件的表单的name
            var arr = [];
            for(x in this.keyup){
                arr.push(x);
            }
            return arr;
        },
        blurItem : function(){                              //需要监听blur事件的表单的name
            var arr = [];
            for(x in this.blur){
                arr.push(x);
            }
            return arr;
        }
    }
    var setfn = {
        inarr : function(arr,str){                          //判断数组中是否存在str，ie8以下不支持indexOf方法
            for(var i=0;i<arr.length;i++){
                if( str === arr[i] ) return true;
            }
            return false;
        },
        showError : function(item,str){                     //显示错误
            var parents = item.parents('.form-item');
            var tip = parents.find('.form-tips');
            if( tip.length > 0 ){
                parents.find('.form-error-tips').text(str);
                return;
            }

            var left = item.position().left + item.width() + 16;
            var html = '<div class="form-tips"><p class="bg"></p><i></i><p class="form-error-tips"></p></div>';
            parents.append(html);
            parents.find('.form-error-tips').text(str);

            tip = parents.find('.form-tips');
            tip.css({
                'left': left + 'px',
                'top': item.innerHeight()/2 - tip.innerHeight()/2 + 'px'
            });
            tip.fadeIn(100);
        },
        hideError : function(item){                         //隐藏错误
            item.parents('.form-item').find('.form-tips').fadeOut(100).remove();
        },
        ajaxCallBack : function(fn){
            if(typeof fn == 'function') fn();
        }
    }	

    function formtest(params) {
        this.setting = {
            enterLimit: false,                                //是否启用数字输入限制
            beforeSub: '',                                    //表单提交前执行的函数
            ajaxtest: {                                       //通过ajax验证
                state : 'off',                                //开启、关闭验证
                testItem : '',                                //需要验证的表单元素
                callback : '',                                //调用ajax，返回结果值true/false
                success : '',                                 //验证成功执行函数
                defeate : '',                                 //验证失败执行函数
                errorTip : '匹配失败',                                //验证失败提示内容
                showTip : 'off'                               //丢失光标时是否显示错误
            },
            callback : ''                                     //表单提交
        };
        if(!params) params = this.setting;
        if(typeof params.ajaxtest != 'object') params.ajaxtest = this.setting.ajaxtest;
        if(!params.ajaxtest.state) params.ajaxtest.state = this.setting.ajaxtest.state;
        if(!params.ajaxtest.errorTip) params.ajaxtest.errorTip = this.setting.ajaxtest.errorTip;
        if(!params.ajaxtest.showTip) params.ajaxtest.showTip = this.setting.ajaxtest.showTip;

        this.init(params);
    };
    formtest.prototype = {
        init: function(params) {
            if( reqItem.length > 0 ){                                 //初始化验证必填项
                setTimeout(function(){
                },200);
            }
            if(params.ajaxtest.state == 'on' && params.ajaxtest.testItem){
                setTimeout(function () {
                    flag = params.ajaxtest.callback();
                    if(flag){
                        setfn.ajaxCallBack(params.ajaxtest.success);
                    }
                },500);
            }

            this.action(params);
            this.sub(params);
        },
        action: function(params){
            var timer;
            if(params.ajaxtest.state == 'on' && params.ajaxtest.testItem){
                params.ajaxtest.testItem.on('keydown',function(e){
                    if(timer) clearTimeout(timer);
                    var e = e || window.event;
                    var c = e.keyCode;
                    if( setfn.inarr(allowCode,c) ) setfn.ajaxCallBack(params.ajaxtest.defeate);
                });
            }
            testItem.on('keyup',function(){                          //键入事件监听
                var that = $(this);
                var name = that.attr('name');
                var type = that.attr('type');
                var value = that.val();
                var ajaxflag = params.ajaxtest.state == 'on' && that[0]==params.ajaxtest.testItem[0];

                if( !setfn.inarr(testSet.keyupItem(),name) || type == ('checkbox' || 'radio') ) return;
                if( !value ){
                    that.removeClass('form-error');
                    if(errorList[name]) delete errorList[name];
                    if(errorType[name] == 1 || errorType[name] == 4){
                        delete errorType[name];
                        setfn.hideError(that);
                    }
                    return;
                }

                if(params.enterLimit && type == 'tel'){
                    value = value.replace(value.match(/[^\d]/),'');
                    that.val( value );
                }

                if( setfn.inarr(testSet.keyupItem(),name) ){
                    if( !testSet.keyup[name](value) ){
                        that.addClass('form-error');
                    }else{
                        that.removeClass('form-error');
                        if(errorList[name]) delete errorList[name];
                        if(errorType[name] != 2){
                            delete errorType[name];
                            setfn.hideError(that);
                        }
                    }
                    if( errorList[name] ){
                        setfn.showError(that,errorList[name]);
                        if(ajaxflag){
                            flag = false;
                            setfn.ajaxCallBack(params.ajaxtest.defeate);
                        }
                    }
                }

                if(ajaxflag){
                    if(!errorList[name]){
                        timer = setTimeout(function () {
                            if(!testSet.blur[name](value)) return;
                            flag = params.ajaxtest.callback();
                            if(flag){
                                setfn.ajaxCallBack(params.ajaxtest.success);
                            }else{
                                setfn.ajaxCallBack(params.ajaxtest.defeate);
                                errorList[name] = params.ajaxtest.errorTip;
                                errorType[name] = 4;
                                setfn.showError(params.ajaxtest.testItem,errorList[name]);
                            }
                            clearTimeout(timer);
                        },500);
                    }
                }
            });

            testItem.on('blur',function(){                                   //丢失光标事件监听
                function setname(){
                    var num = (function(){
                        var n;
                        for(var i=0;i<reqItem.length;i++){
                            if(obj[0] == reqItem[i][0]) n = i;
                        }
                        return n;
                    })();
                    return 'require' + num;
                }

                var obj = $(this);
                var type = obj.attr('type');
                var name = obj.attr('name') ? obj.attr('name') : setname();
                var value = obj.val();
                var tagname = obj[0].tagName.toLowerCase();
                var require = obj.attr('required') ? true : false;
                var category = obj.attr('category');
                    category = category ? category : '';

                if( tagname == 'select' || type == ('checkbox' || 'radio') ) return;
                if( !value && !require ){                                    //空值，非必需
                    if(errorType[name]) delete errorType[name];
                    setfn.hideError(obj);
                    return;
                }

                function testError(){                                        //验证失败显示错误，删除必填项储存的此项数据
                    if( reqValue[name] ) delete reqValue[name];
                    setfn.showError(obj,errorList[name]);
                }

                if( !value ){                                                //空值，必需
                    errorList[name] = category + '不可为空';
                    if(name) errorType[name] = 3;
                    testError();
                }else{                                                       //非空值
                    if( setfn.inarr(testSet.keyupItem(),name) && !testSet.keyup[name](value) ){
                        testError();
                        return;
                    }
                    if( setfn.inarr(testSet.blurItem(),name) && !testSet.blur[name](value) ){
                        testError();
                        return;
                    }

                    if( require ){                                           //储存必填数据
                        reqValue[name] = value;
                    }
                    obj.removeClass('form-error');
                    if(errorList[name] && errorType[name] != 4) delete errorList[name];
                    if(errorType[name] != 4){
                        delete errorType[name];
                        setfn.hideError(obj);
                    }

                    if(name == 'password' && value == $('input[name="repassword"]').val()){
                        reqValue['repassword'] = value;
                        if(errorList['repassword']) delete errorList['repassword'];
                        if(errorType['repassword']) delete errorType['repassword'];
                        setfn.hideError($('input[name="repassword"]'));
                    }
                }
            });
        },
        sub: function(params){
            $('#form-sub').on('click',function(){
                if(typeof params.beforeSub == 'function'){
                    params.beforeSub();
                }
                for(var i=0;i<reqItem.length;i++){                          //检测必填项填
                    var name = reqItem[i].attr('name') ? reqItem[i].attr('name') : 'require' + i;

                    if( !reqValue[name] ){
                        var value = reqItem[i].val();
                        var category = reqItem[i].attr('category');
                            category = category ? category : '';

                        if( !value ){
                            errorList[name] = category + '不可为空';
                            errorType[name] = 3;
                            reqItem[i].focus();
                            setfn.showError(reqItem[i],errorList[name]);
                            return;
                        }
                        if( setfn.inarr(testSet.blurItem(),name) && !testSet.blur[name](value) ){
                            setfn.showError(reqItem[i],errorList[name]);                        
                            return;
                        }
                        if( setfn.inarr(testSet.keyupItem(),name) && !testSet.keyup[name](value) ){
                            setfn.showError(reqItem[i],errorList[name]);
                            return;
                        }
                    }
                }

                var errors = [];
                for(x in errorList){
                    errors.push(x);
                }
                if( errors.length > 0 ){                             //存在错误
                    for(var i=0;i<errors.length;i++){
                        var item = $('#form-test').find("[name='" + errors[i] + "']");
                        setfn.showError(item,errorList[errors[i]]);
                    }
                    return;
                }

                if(params.ajaxtest.state == 'on'){
                    if(!flag){
                        errorList[name] = params.ajaxtest.errorTip;
                        errorType[name] = 4;
                        setfn.showError(params.ajaxtest.testItem,errorList[name]);
                        return;
                    }
                }
                if(typeof params.callback == 'function') params.callback();
            });
        }
    };
    window.formtest = formtest;
})(jQuery,window);
