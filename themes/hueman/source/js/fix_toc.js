// 固定目录js文件
var lb_article = (function ($) {
    var _sideBarShow = function () {
        //toc-parent div: 这里面只包装了toc div，为了计算原本toc目录div在window里面的位置
        //toc-parent距离窗口顶部的距离
        var toc_top = $('#toc-parent').offset().top;
        //文档距离窗口顶部的距离
        var doc_scrollTop = $(document).scrollTop();
        //相减得到toc-parent当前距离窗口顶端的距离
        var toc_scrollTop = toc_top - doc_scrollTop;

        //如果目录处于顶部，则添加toc-article样式将toc固定在顶部
        if (toc_scrollTop <= 0) {
            $("#toc").addClass("toc-article");
        } else if (toc_scrollTop > 0 && $("#toc").has("toc-article")) {
            $("#toc").removeClass("toc-article");
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