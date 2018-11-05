// 固定目录js文件，目前未生效
var lb_article = (function ($) {
    var _sideBarShow=function () {
        var scrollTop=$("body").scrollTop();
        if(scrollTop>160){
            $("#toc").addClass("toc-articleP");
        }else if(scrollTop<=160&&$("#toc").has("toc-articleP")){
            $("#toc").removeClass("toc-articleP");
        }
    };
    var pub = {
        sidebar: function () {
            _sideBarShow();
            $(window).scroll(function () {
                _sideBarShow();
            });
        }
    };
    return pub;
})(jQuery);
lb_article.sidebar();