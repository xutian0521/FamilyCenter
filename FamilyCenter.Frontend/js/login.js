$(function() {
    //---------------------初始化-------------------------
    /*全局变量 语言类型*/
    languageType = null;

    (function($) {

        $.fn.cloudLang = function(params) {

            var defaults = {
                file: 'Language_in.xml',
                lang: 'en'
            };

            var aTexts = new Array();

            if (params) $.extend(defaults, params);

            $.ajax({
                type: "GET",
                url: defaults.file,
                dataType: "xml",
                success: function(xml) {
                    $(xml).find('text').each(function() {
                        var textId = $(this).attr("id");
                        var text = $(this).find(defaults.lang).text();

                        aTexts[textId] = text;
                    });

                    $.each($("*"), function(i, item) {
                        //alert($(item).attr("langtag"));
                        if ($(item).attr("langtag") != null)
                            $(item).fadeOut(150).fadeIn(150).text(aTexts[$(item).attr("langtag")]);
                    });
                }
            });
        };

    })(jQuery);


    $("#lang-en").click(function() {
        $("body").cloudLang({
            lang: "en",
            file: "xml/Language_in.xml"
        });
    });

    $("#lang-zh").click(function() {
        $("body").cloudLang({
            lang: "zh",
            file: "xml/Language_in.xml"
        });
    });

    init();

    //---------------------初始化-------------------------

    //---------------------视觉效果-------------------------
    var $user = $("#u"); //用户名
    var $uBg = $("#uBg"); //用户名的tips
    var $pwd = $("#p"); //密码
    var $pBg = $("#pBg"); //密码的tips
    $user.focus(function() {

        if ($user.val().length == 0) {
            $uBg.attr("class", "tipsBg_focus");
        }
        $user.css("border-color", "#ff6d00");

    });
    $user.blur(function() {
        if ($user.val().length == 0) {
            $uBg.attr("class", "tipsBg");
        }
        $user.css("border-color", "#e09936");

    });
    $user.keyup(function() {

        if ($user.val().length != 0) {
            $uBg.attr("class", "tipsBg_keyUp")
        } else {
            $uBg.attr("class", "tipsBg_focus ");
        }
    });

    $pwd.focus(function() {
        if ($pwd.val().length == 0) {

            $pBg.attr("class", "tipsBg_focus");
        }
        $pwd.css("border-color", "#ff6d00");
    });
    $pwd.blur(function() {
        if ($pwd.val().length == 0) {
            $pBg.attr("class", "tipsBg")
        }
        $pwd.css("border-color", "#e09936");

    });
    $pwd.keyup(function() {
        if ($pwd.val().length != 0) {
            $pBg.attr("class", "tipsBg_keyUp")
        } else {
            $pBg.attr("class", "tipsBg_focus ");
        }
    });
    //---------------------视觉效果-------------------------


    //---------------------验证-------------------------
    /*登陆按钮*/
    var $btn = $("#btn_login");
    /*提示框div盒子*/
    var $prompt = $(".prompt");
    $btn.click(function() {
        if ($user.val().length == 0) {
            GetLanguageAndSetStr("UserNameEmpty", function(str) {
                $(".prompt").text(str);
            })
            return;
        }
        if ($pwd.val().length == 0) {
            GetLanguageAndSetStr("UserNameEmpty", function(str) {
                $(".prompt").text(str);
            })
            return;
        }



    });
    //---------------------验证-------------------------





    //---------------------方法封装-------------------------
    /* 获取配置文件的语言设置并且读取对应语言的文本并赋值给html标签
    1.id xml中提示文本的id
    2.fn 获取指定语言的提示文本后 要执行的方法,不在此方法中执行,在SearchPromptStr方法中的回调函数中执行.
    说明:因为此方法是用的ajax请求,查询xml都在success的回调函数中执行,所以查询后的要操作xml就需要一个参数,吧要执行的方法传进来,这里使用了fn作为参数
    */
    function GetLanguageAndSetStr(id, fn) {
        $.ajax({
            url: "xml/SystemConfig.xml",
            date: "?ran=" + Math.random(), //这里在后面加一个随机参数防止浏览器使用缓存  参数格式：?ran=123&id=111
            dataType: "xml",
            type: "GET",
            timeout: 2000,
            error: function(xml) {
                alert("加载系统配置XML 文件出错！");
            },
            success: function(xml) {
                $(xml).find("Language").each(function(i) {
                    var language = $(this).text();
                    SearchPromptStr(id, language, fn);
                });
            }
        });
    }

    /*请求xml文件根据传人id和language ，执行指定方法 */
    function SearchPromptStr(id, language, fn) {
        $.ajax({
            url: "xml/Language_in.xml",
            date: "?ran=" + Math.random(), //这里在后面加一个随机参数防止浏览器使用缓存
            dataType: 'xml',
            type: 'GET',
            timeout: 2000,
            error: function(xml) {
                alert("加载国际化语言包XML 文件出错！");
            },
            success: function(xml) {
                $(xml).find("text").each(function(i) {
                    if ($(this).attr("id") == id) {
                        var strTemp = $(this).children(language).text();
                        fn(strTemp);
                    }

                    ///后续操作。。。
                });

            }
        });
    }

    function init() {
            $.ajax({
                url: "xml/SystemConfig.xml",
                date: "?ran=" + Math.random(), //这里在后面加一个随机参数防止浏览器使用缓存  参数格式：?ran=123&id=111
                dataType: "xml",
                type: "GET",
                timeout: 2000,
                error: function(xml) {
                    alert("加载系统配置XML 文件出错！");
                },
                success: function(xml) {
                    $(xml).find("Language").each(function(i) {
                        var language = $(this).text();
                        if (language == "en") {
                            //初始化文本框 背景图片
                            $("#u").attr("class", "user-en ");
                            $("#p").attr("class", "pwd-en ");
                            //初始化控件文本
                            $("#lang-en").click();
                            languageType = language;
                        }
                        if (language == "zh") {
                            $("#lang-zh").click();
                            languageType = language;
                        }

                    });
                }
            });
        }
        //---------------------方法封装-------------------------

});
