/* jshint esversion: 6 */

function splitWindow(pu)
{
    let top = document.getElementById("top");

    let x = pu.clientX;
    let y = pu.clientY;

    let win = findWindow(top, x, y);

    if(win != null && win.doc != null)
    {
        clearWindow(pu);
    }

    if(win != null && win.doc == null)
    {
        let rect = win.getBoundingClientRect();

        let lx = x - rect.left;
        let rx = rect.right - x;
        let ty = y - rect.top;
        let by = rect.bottom - y;

        let div1 = document.createElement('div');
        let sepr = document.createElement('div');
        let div2 = document.createElement('div');

        if(lx <= rx && lx <= ty && lx <= by)
        {
            div1.className = "hdiv";
            sepr.className = "hsep";
            div2.className = "hdiv";
        }

        if(rx <= lx && rx <= ty && rx <= by)
        {
            div1.className = "hdiv";
            sepr.className = "hsep";
            div2.className = "hdiv";
        }

        if(ty <= lx && ty <= rx && ty <= by)
        {
            div1.className = "vdiv";
            sepr.className = "vsep";
            div2.className = "vdiv";
        }

        if(by <= lx && by <= rx && by <= ty)
        {
            div1.className = "vdiv";
            sepr.className = "vsep";
            div2.className = "vdiv";
        }
        
        win.appendChild(div1);
        win.appendChild(sepr);
        win.appendChild(div2);

        div1.id = win.id + div1.className + "1";
        div2.id = win.id + div2.className + "2";
        
        if(win.className == "hdiv")
        {
            win.className = "h0div";
        }
        else if(win.className == "vdiv")
	    {
	        win.className = "v0div";
        }
        else if(win.className == "top")
	    {
	        win.className = "top0";
        }
        
        initMouseEvents(win);
    }
}

function eraseWindow(pu)
{
    let top = document.getElementById("top");

    let x = pu.clientX;
    let y = pu.clientY;

    let win = findWindow(top, x, y);

    if(win != top && win != null)
    {
        parent = win.parentNode;

        let sister = null;
        let childs = parent.childNodes;
        let cno = childs.length;
        
        for(let i = 0; i < cno; i++)
        {
            let child = childs[i];
            
            if(child.className == "hdiv"  || child.className == "vdiv" ||
               child.className == "v0div" || child.className == "h0div" )
            {
                if(child != win)
                {
                    sister = child;
                    break;
                }
            }
        }
        
        let ctr = 0;
        
        while(sister != null && sister.firstChild != null)
        {
            let child = sister.firstChild;
            
            if(child.className == "hdiv"  || child.className == "vdiv" ||
               child.className == "v0div" || child.className == "h0div" )
            {
                ctr += 1;    
            }

            if(sister.doc != null)
            {
                parent.doc = sister.doc;
                parent.docType = sister.docType;
            }
            
            parent.appendChild(sister.firstChild);
        }
        
        if(ctr == 0)
        {
            if(parent.className == "h0div")
            {
                parent.className = "hdiv";
            }
            else if(parent.className == "v0div")
            {
                parent.className = "vdiv";
            }
            else if(parent.className == "top0")
            {
                parent.className = "top";
            }
        }
        
        ctr = 0;
        
        while(ctr < cno && parent.firstChild != null)
        {
            ctr += 1;    
            parent.removeChild(parent.firstChild);
        }
    }

    resizeWindow();
}

function setWindow(pu,docType)
{
    let top = document.getElementById("top");

    let x = pu.clientX;
    let y = pu.clientY;

    let win = findWindow(top, x, y);

    if(win != null && win.doc != null)
    {
        clearWindow(pu);
    }
    
    if(win != null && win.doc == null)
    {
        let leaf = document.createElement("div");
        leaf.className = "leaf";
        leaf.id = win.id + "leaf";
        win.appendChild(leaf);

        let name = top.doclist[docType-1];
        let func = top.createdict[name];

        if(func != undefined)
        {
            win.doc = func(leaf);
        }
        
        if(win.doc == null || win.doc == undefined)
        {
            win.doc = null;
            let childs = win.childNodes;
            
            let ctr = 0;
            let cno = childs.length;
            
            while(ctr < cno && win.firstChild != null)
            {
                ctr += 1;    
                win.removeChild(win.firstChild);
            }
        }
        else
        {
            win.docType = docType;
        }
    }

    return win;
}

function clearWindow(pu)
{
    let top = document.getElementById("top");

    let x = pu.clientX;
    let y = pu.clientY;

    let win = findWindow(top, x, y);

    console.log(pu);
    console.log(win);
    
    if(win != null && win.doc != null)
    {  
        while(win.firstChild != null)
        {
            win.removeChild(win.firstChild);
        }
        
        win.doc = null;
        win.docType = null;
    }

    return win;
}

function findWindow(parent,x,y)
{
    let win = null;

    let childs = parent.childNodes;

    for(let i = 0; i < childs.length && win == null; i++)
    {
        child = childs[i];

        if(child.className == "vdiv"  || child.className == "hdiv" ||
           child.className == "v0div" || child.className == "h0div" )
        {
            win = findWindow(child,x,y);
        }
    }

    if(win == null)
    {
        let rect = parent.getBoundingClientRect();

        if( x > rect.left && x < rect.right && y > rect.top && y < rect.bottom)
        {
            win = parent;
        }
    }

    return win;
}

function resizeWindow()
{
    let top  = document.getElementById("top");

    if(top != null)
    {
        renderWindows(top,1);
    }
}

function renderWindows(top,reason)
{
    renderWindowsInt(top,top,reason)
}

function renderWindowsInt(root,top,reason)
{
    if(top != null)
    {
        if(top.doc != undefined)
        {
            let name = root.doclist[top.docType-1];
            let func = root.renderdict[name];

            if(func != undefined)
            {
                func(top.doc,reason);
            }
        }
        else
        {
            let childs = top.childNodes;
        
            for(let i = 0; i < childs.length; i++)
            {
                let child = childs[i];

                if(child.className == "hdiv"  || child.className == "vdiv" ||
                   child.className == "h0div" || child.className == "v0div" )
                {
                    renderWindowsInt(root,child,reason);
                }
            }
        }
    }
}

function encodeWindows(top,str)
{
    let fnd = 0;

    if(top != null)
    {
        if(top.doc != null)
        {
            fnd = 1;

            if(top.docType < 10)
            {
                str += "L:0" + top.docType + ";";
            }
            else
            {
                str += "L:" + top.docType + ";";
            }
        }
        else
        {
            let childs = top.childNodes;
        
            for(let i = 0; i < childs.length; i++)
            {
                let child = childs[i];

                if(child.className == "v0div"  || child.className == "vdiv")
                {
                    fnd = 50;

                    if(child.style.height != "")
                    {
                        fnd = child.style.height.substring(5,7);

                        if(fnd.substring(1,2) == "%")
                        {
                            fnd = "0" + fnd.substring(0,1);
                        }
                    }

                    str = encodeWindows(child,str + "V:" + fnd + ";");
                }
                else if(child.className == "hdiv" || child.className == "h0div" )
                {
                    fnd = 50;

                    if(child.style.width != "")
                    {
                        fnd = child.style.width.substring(5,7);

                        if(fnd.substring(1,2) == "%")
                        {
                            fnd = "0" + fnd.substring(0,1);
                        }
                    }

                    str = encodeWindows(child,str + "H:" + fnd + ";");
                }
            }
        }
    }

    if(fnd == 0)
    {
        str += "L:00;";
    }

    return str;
}

function resetWindows(top)
{
    if(top == null)
    {
        return;
    }
    
    if(top.doc != null)
    {
        top.doc     = null;
        top.docType = null;
    }

    let childs = top.childNodes;
        
    for(let i = 0; i < childs.length; i++)
    {
        let child = childs[i];

        resetWindows(child);
    }

    while(top.firstChild)
    {
        top.removeChild(top.firstChild);
    }
}

function recodeWindows(top,str)
{
    let dpx = "% - 3px)";
 
    for(let i = 0; i < 2; i++)
    {
        if(str.length < 5)
        {
            break;
        }

        let typ = str.substring(0,1);
        let val = str.substring(2,4);
        let num = parseInt(val,10);

        str = str.substring(5,str.length);

        if(typ != "L")
        {
            if(top.className == "hdiv")
            {
                top.className = "h0div";
            }
            else if(top.className == "vdiv")
            {
                top.className = "v0div";
            }
            else if(top.className == "top")
            {
                top.className = "top0";
            }
        }

        if(typ == "H")
        {
            let div = document.createElement('div');
            div.style.width = "calc(" + num + dpx;
            div.className = "hdiv";
            top.appendChild(div);

            if(i == 0)
            {
                let sep = document.createElement('div');
                sep.className = "hsep";
                top.appendChild(sep);
                div.id = top.id + div.className + "1"; 
            }
            else
            {
                div.id = top.id + div.className + "2"; 
            }

            str = recodeWindows(div,str);
        }
        else if(typ == "V")
        {
            let div = document.createElement('div');
            div.style.height = "calc(" + num + dpx;
            div.className = "vdiv";
            top.appendChild(div);

            if(i == 0)
            {
                let sep = document.createElement('div');
                sep.className = "vsep";
                top.appendChild(sep);
                div.id = top.id + div.className + "1"; 
            }
            else
            {
                div.id = top.id + div.className + "2"; 
            }

            str = recodeWindows(div,str);
        }
        else if(typ == "L")
        {
            if(num > 0)
            {
                let win  = top;
                let leaf = document.createElement("div");
                leaf.className = "leaf";
                leaf.id = win.id + "leaf";
                win.appendChild(leaf);
 
                let rtop = document.getElementById("top");
                let name = rtop.doclist[num-1];
                let func = rtop.createdict[name];

                if(func != undefined)
                {
                    win.doc = func(leaf);
                }
 
                win.docType = num;
            }
            break;
        }
    }

    return str;
}

function decodeWindows(top,str)
{
    if(top == null || str == null || str.length < 4)
    {
        return;
    }

    resetWindows(top);
    top.className = "top";
    recodeWindows(top,str);
    initMouseEvents(top);
}

function initKeyEvents(top)
{
    top.keyCode  = 0;
    top.shiftLock = 0;
}

function keyIsUp(event)
{
    let top  = document.getElementById("top");
    top.keyCode = 0;

    if(event.getModifierState('CapsLock') == false)
    {
        top.shiftLock = 0;
    }
}

function keyIsDown(event)
{
    let top  = document.getElementById("top");
    top.keyCode  = event.keyCode;
 
    if(event.getModifierState('CapsLock') == true)
    {
        top.shiftLock = 1;
    }
}
