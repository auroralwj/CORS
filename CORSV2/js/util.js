﻿
(function (M) {

    /**
     * 初始化Ajax请求
     * @param {object} option 参数
     *      {
     *          data: {key: val},        //数据JSON
     *          method: 'GET',           //GET 或者 POST
     *          url: 'http://qq.com',    //cgi地址
     *          success: function(res){  //成功回调
     *      }
     * @兼容性   PC: IE 6+   & Mobile All
     * @支持     XHR2 跨域
     *
     * @建议分类 HTTP
     *
     * @依赖方法   createInstance
     */
    var initRequest = function (option) {
        console.log("Proxy starts creating Ajax!!");

        var httpRequest = createInstance();
        var success = option.success;
        var url = option.url;
        var method = option.method;
        var data = option.data;

        var dataArr = [];
        for (var i in data) {
            dataArr.push(i + "=" + data[i]);
        }

        if (method == "GET") {
            url += "?" + dataArr.join("&");
        }


        if (httpRequest) {
            httpRequest.onreadystatechange = function () {
                if (this.readyState == 4) {
                    console.log("Proxy Ajax loaded!!");
                    success && success(httpRequest.responseText);
                }
            };

            httpRequest.open(method, url, false);
            httpRequest.withCredentials = true;
            //httpRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            //httpRequest.setRequestHeader("X-Requested-From","_TC_QC_jsProxy_");

            httpRequest.send(JSON.stringify(data));
            console.log("Proxy created Ajax done!!method: " + method + "; data: " + JSON.stringify(data) + "----already send");
        } else {
            console.error("Proxy created Ajax Error!!");
        }
    };

    /**
     * 返回一个XHR实例
     * @兼容： PC: IE6 + & Mobile All
     * @参数： 空
     * @依赖： 无
     */
    var createInstance = function () {
        var xmlHttp;

        return new XMLHttpRequest();

        try {
            // Firefox,Opera 8.0+,Safari
            xmlHttp = new XMLHttpRequest();
        } catch (e) {
            // Internet Explorer
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    return false;
                }
            }
        }

        return xmlHttp;
    };


    /**
     * 通过模板字符串生成HTML
     * @param {String} tmplStr  模板字符串
     * @param {Object} data 模板数据
     *
     * @兼容性： PC: IE 6+ & Mobile All
     * 
     * @依赖： 无
     *
     * @备注： 模板以<? ?>分隔JS代码如  模板内容中暂时无法使用单引号（双引替代）模板如
     *  <h2 class="<?=className?>"></h2><? alert("OK"); ?>
     */
    var getTmpl = function (tmplStr, data) {
        var result;

        var varHtml = "";
        for (var i in data) {
            varHtml += "var " + i + " = data." + i + ";";
        }

        tmplStr = tmplStr.replace(/\s+/g, " ");
        tmplStr = varHtml + "var __result = ''; ?>" + tmplStr + "<?";
        tmplStr += " return __result;";
        tmplStr = tmplStr.replace(/<\?=([^\?]+)\?>/g, "' + $1 + '").replace(/<\?/gi, "';").replace(/\?>/g, "__result += '");

        var str = new Function("data", tmplStr);
        result = str(data);

        return result;
    };

    /**
     * 渲染HTML中的模板标签
     * @param {String} 模板标签的id
     * @param {Object} 模板数据
     * @param {boolean} 下次渲染是否以追加的方式渲染 默认为非
     *
     * @兼容性 PC: IE 9+ & Mobile All
     * @依赖 getTmpl
     *
     * @备注： 模板如
     * <div>
     *  <script type='text/plain' id='list'>
     *      <? for(var i = 0; i < 10; i ++){
     *      ?>
     *
     *      <h1><?=i?></h1>
     *
     *      <? } ?>
     *  </script>
     *  </div>
     *
     *  调用如：  Util.renderTmpl('list', {});//会在div下直接生成模板HTML输出
     */
    //保留上次的el地址，便于清除
    var lastRenderEls = {};
    var renderTmpl = function (id, data, isAppend) {
        var tmplNode = document.getElementById(id);
        var tmplString = tmplNode.innerHTML;
        var result = getTmpl(tmplString, data);

        if (!lastRenderEls[id]) lastRenderEls[id] = [];

        if (!isAppend) {
            //清除上次的渲染
            for (var i = 0; i < lastRenderEls[id].length; i++) {
                var lastItem = lastRenderEls[id][i];

                lastItem.parentNode.removeChild(lastItem);
            }
        }

        lastRenderEls[id] = [];


        var div = document.createElement("div");
        div.innerHTML = result;

        var divChildren = div.childNodes;

        while (divChildren.length > 0) {
            lastRenderEls[id].push(divChildren[0]);

            tmplNode.parentNode.insertBefore(divChildren[0], tmplNode);
        }
    };

    /**
     * 通过代理增加事件
     * @param {HTMLNode} proxyNode  要绑定到的代理元素
     * @param {String} selector 选择器  仅支持单字符串 支持# . tag选择 如 #a或.a或li等
     * @param {String} eventType  事件类型  如click等
     * @param {Function} func 处理函数
     *
     * @兼容 PC: IE 6+ & Mobile All
     * @依赖 无
     */
    var addEvent = function (proxyNode, selector, eventType, func) {//为代理节点添加事件监听
        var proName = "", flag = 0;
        if (typeof (selector) == "string") {

            flag = 1;
            switch (true) {
                case /^\./.test(selector):
                    proName = "className";
                    selector = selector.replace(".", "");
                    selector = new RegExp(" *" + selector + " *");
                    break;
                case /^\#/.test(selector):
                    proName = "id";
                    selector = new RegExp(selector.replace("#", ""));
                    break;
                default:
                    selector = new RegExp(selector);
                    proName = "tagName";
            }

        }

        var addEvent = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventType = window.addEventListener ? eventType : "on" + eventType;

        proxyNode[addEvent](eventType, function (e) {

            function check(node) {

                if (flag) {
                    if (selector.test(node[proName])) {

                        func.call(node, e);
                        return;
                    };
                } else {
                    if (selector == node) {
                        func.call(node, e);
                        return;
                    };
                }

                if (node == proxyNode || node.parentNode == proxyNode) return;
                check(node.parentNode);
            }

            check(e.srcElement);
        });
    };
    //读取元素的css属性值
    var css = function (el, property) {
        try {
            return el.currentStyle[property] || el.style[property];
        } catch (e) {
            var computedStyle = getComputedStyle(el);
            return computedStyle.getPropertyValue(property);
        }
    };

    //执行动画   类似jquery animate
    var animate = function (el, endCss, time, callBack) {
        var FPS = 60;
        var everyStep = {}, currStyle = {};

        for (var i in endCss) {
            var currValue = parseInt(this.css(el, i));
            currStyle[i] = currValue;

            everyStep[i] = parseInt(parseInt(endCss[i]) - currValue) / time;
        }

        //当前frame
        var frame = 0, timer;

        function step() {
            frame++;

            //当前时间 ms
            var t = frame / FPS * 1000;

            //对时间做缓动变换

            //标准化当前时间
            var t0 = t / time;

            //变换函数
            var f = function (x, p0, p1, p2, p3) {

                //二次贝塞尔曲线
                //return Math.pow((1 - x), 2) * p0 + (2 * x) * (1 - x) * p1 + x * x * p2; 

                //基于三次贝塞尔曲线 
                return p0 * Math.pow((1 - x), 3) + 3 * p1 * x * Math.pow((1 - x), 2) + 3 * p2 * x * x * (1 - x) + p3 * Math.pow(x, 3);
            }

            //对时间进行三次贝塞尔变换 输出时间
            var t1 = f(t0, 0.3, 0.82, 1.0, 1.0) * time;

            for (var i in everyStep) {
                if (i == "opacity") el.style[i] = (currStyle[i] + everyStep[i] * t1);
                else el.style[i] = (currStyle[i] + everyStep[i] * t1) + "px";
            }

            if (frame == time / 1000 * FPS) {
                clearInterval(timer);
                callBack && callBack();
            }
        }

        timer = setInterval(step, 1000 / FPS);

        return {
            stop: function () {
                clearInterval(timer);
            }
        };

    };

    var getUrlParam = function (n) {
        var m = window.location.search.match(new RegExp('(\\?|&)' + n + '=([^&]*)(&|$)'));
        return !m ? '' : decodeURIComponent(m[2]);
    };

    var getParentData = function (node, dataName) {
        var parentNode = node;

        while (parentNode) {
            if (parentNode.dataset[dataName]) {
                return parentNode.dataset[dataName];
            }

            parentNode = parentNode.parentNode;
        }

    };

    var util = {
        request: initRequest,
        getTmpl: getTmpl,
        renderTmpl: renderTmpl,
        addEvent: addEvent,
        animate: animate,
        css: css,
        getUrlParam: getUrlParam,
        getParentData: getParentData
    };

    window.Util = util;
})();