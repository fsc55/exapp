/* jshint esversion: 6 */

(function ()
{
    let top  = document.getElementById("top");
    top.base = {};

    top.eventdict = new Array(2);
    top.eventdict[0] = {};
    top.eventdict[1] = {};

    initPopupMenu(top);
    initMouseEvents(top);
    initKeyEvents(top);
    changeStyle();
    
    document.oncontextmenu = function() {return false;};
    window.addEventListener("mouseup",mouseUp);
    window.addEventListener("resize",resizeWindow);
    window.addEventListener("contextmenu",popupMenu);
    window.addEventListener("keyup",  keyIsUp);
    window.addEventListener("keydown",keyIsDown);
})();

