in_focus = false;
function find_video(){
    $("object[type=application/x-shockwave-flash]").hover(function(){
        show_button(this);
        in_focus = true;
    }, function(){
        in_focus = false;
    })
    $("embed").hover(function(){
        show_button(this);
        in_focus = true;
    }, function(){
        in_focus = false;
    })
    setTimeout(find_video, 500);
}
function show_button(obj){
    if( $('#fp_popup').length ){
        return;
    }
    text = chrome.i18n.getMessage("ui_popup");
    popup = $("<div id='fp_popup'><a id='fp_b_p' href='javascript:void(0);'>"+text+"</a></div>");
    position = $(obj).offset();
    popup.css("position", "absolute");
    popup.css("left", position.left + "px");
    popup.css("top", (position.top-23) + "px");
    $('body').append(popup);
    popup.find('a').click(function(){
        tmp = $(obj).clone();
        tmp.wrap("<div id='fp_tmp_t'/>")
        html = tmp.parent().html();
        tmp.parent().remove();
        chrome.extension.sendRequest({
            html: html,
            width: $(obj).width(),
            height: $(obj).height(),
            url: window.location.href,
            title: document.title
        });
    });
    popup.hover(function(){
        in_focus = true;        
    }, function(){
        in_focus = false;
    });
}
function hide_button(){
    if( !in_focus ){
        $('#fp_popup').remove();
    }
    setTimeout(hide_button, 800);
}
setTimeout(hide_button, 800);
setTimeout(find_video, 500);
