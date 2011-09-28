var current_hover_obj = null;
var detected_objs = [];
var in_focus = false;

function bind_hover_event(obj){
    if( detected_objs.indexOf(obj) != -1 ){
        return;
    }
    detected_objs.push(obj);
    $(obj).hover(function(){
        in_focus = true;
        show_button(this);
    }, function(){
        in_focus = false;
        setTimeout(hide_button, 500);
    });
}

function find_video(){
    $("object[type=application/x-shockwave-flash]").each(function(index, obj){
        bind_hover_event(obj);
    });
    $("embed").each(function(index, obj){
        bind_hover_event(obj);
    });
    setTimeout(find_video, 500);
}

function show_button(obj){
    var text = chrome.i18n.getMessage("ui_popup");
    var popup;
    if( $('#fp_popup').length ){
        popup = $('#fp_popup');
    }else{
        popup = $("<div id='fp_popup'><a id='fp_b_p' href='javascript:void(0);'>"+text+"</a></div>");
        popup.hide();
        $('body').append(popup);
    }
    position = $(obj).offset();
    popup.css("position", "absolute");
    popup.css("left", position.left + "px");
    popup.css("top", (position.top - 23) + "px");
    link = popup.find('a');
    link.unbind('click');
    link.click(function(){
        var width = $(obj).width();
        var height = $(obj).height();
        tmp = $(obj).clone();
        tmp.wrap("<div id='fp_tmp_t'/>")
        html = tmp.parent().html();
        if( window.location.href.search('tudou.com') > -1 ){
            if( window.location.href.search(/programs\/view\/(.*)\//) > -1 ){
                var matches = window.location.href.match(/view\/(.*)\//);
                var flash_adrr;
                if( matches && matches.length == 2){
                    flash_adrr = matches[1];
                    html = '<embed src="http://www.tudou.com/v/' + flash_adrr + '/&rpid=31187717/v.swf" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque" width="480" height="400"></embed>';
                    width = 480;
                    height = 400;
                }
            }
            /*
            if( window.location.href.search('/playlist/p') > -1 ){
                var matches = $('body').html().match(/,lid_code = lcode = '(.*)'/)
                if( matches && matches.length == 2){
                    var list_id = matches[1];
                    var iid = (function(href){return (href.match(/\/p\/a\d+i(\d+).*\.html/) || href.match(/[&#\?]iid=(\d+)/) || [])[1]})(location.href);
                    html = '<embed src="http://www.tudou.com/l/' + list_id + '/&iid=' + iid + '/v.swf" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque" width="480" height="400"></embed>'
                    width = 480;
                    height = 400;
                }
            }
            */
        }
        tmp.parent().remove();
        chrome.extension.sendRequest({
            html: html,
            width: width,
            height: height,
            url: window.location.href,
            title: document.title
        });
    });
    popup.hover(function(){
        in_focus = true;
    }, function(){
        in_focus = false;
        $(this).hide();
    });
    popup.show();
}
function hide_button(){
    if( !in_focus ){
        $('#fp_popup').hide();
    }else{
        setTimeout(hide_button, 500);
    }
}
//setTimeout(hide_button, 800);
setTimeout(find_video, 500);
