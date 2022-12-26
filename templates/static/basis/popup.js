/* jshint esversion: 6 */

function popupselect(event)
{
    let top = document.getElementById("top");

    if(event.target.selectedIndex >= 0)
    {
        setWindow(top.popup,event.target.selectedIndex+1);
    }
}

function initPopupMenu(top)
{
    top.createdict = {}
    top.renderdict = {}
    top.doclist = nameContents(top.createdict,top.renderdict);

    top.laf = 0;
    top.popup = new PopupMenu();
    top.popup.bind("top");
    top.popup.setSize(105,0);
    top.popup.add("SplitWindow", function(target){splitWindow(top.popup);});
    top.popup.add("EraseWindow", function(target){eraseWindow(top.popup);});
    top.popup.addSelector(top.doclist,popupselect);
    top.popup.add("ClrContents", function(target){clearWindow(top.popup);});
    top.popup.add("ChangeStyle", function(target){changeStyle(top.popup);});
}

function popupMenu(e)
{
    let top = document.getElementById("top");
    popup = top.popup;
    popup.clientX = e.clientX;
    popup.clientY = e.clientY;
    popup.bind("top");
    return false;
}

function changeStyle()
{
    let top = document.getElementById("top");
    top.laf = 1 - top.laf;

    let old1 = document.getElementsByTagName("link").item(0);
    let old2 = document.getElementsByTagName("link").item(1);
    let new1 = document.createElement("link");
    let new2 = document.createElement("link");
    
    new1.setAttribute("rel","stylesheet");
    new2.setAttribute("rel","stylesheet");
    
    let href = old1.getAttribute("href");
    
    if(href.indexOf("light") == -1)
    {
        new1.setAttribute("href","/static/css/light/own.css");
        new2.setAttribute("href","/static/css/light/tools.css");
    }
    else
    {
        new1.setAttribute("href","/static/css/night/own.css");
        new2.setAttribute("href","/static/css/night/tools.css");
    }
    
    document.getElementsByTagName("head").item(0).replaceChild(new1, old1);
    document.getElementsByTagName("head").item(0).replaceChild(new2, old2);

    setTimeout (function() {renderWindows(top,0);},1);
}

