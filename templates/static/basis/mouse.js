/* jshint esversion: 6 */

function initMouseEvents(top)
{
    let childs = top.childNodes;

    for(let i = 0; i < childs.length; i++)
    {
        let child = childs[i];

        if(child.nodeType == 1 && child.className != null)
        {
            if(child.className == "hsep" || child.className == "vsep")
            {
                child.addEventListener("mousedown",mouseDown);
            }
            else if(child.className == "hdiv"  || child.className == "vdiv" ||
                    child.className == "h0div" || child.className == "v0div" )
            {
                initMouseEvents(child);
            }
        }
    }
}

function mouseUp()
{
    let top = document.getElementById("top");
 
    if(top != null)
    {
        top.div1 = null;
        top.div2 = null;
        top.removeEventListener("mousemove",hmouseMove);
        top.removeEventListener("mousemove",vmouseMove);
 
        let msgout = document.getElementById('description');
  
        if(msgout != null && msgout.value != "")
        {
            let str = encodeWindows(top,"");
            //decodeWindows(top,msgout.value);
            msgout.value = str;
        }

        renderWindows(top,1);
    }

    return false;
}

function mouseDown(e)
{
    e.preventDefault();

    let top = document.getElementById("top");

    let source = e.target || e.srcElement;

    if(source != null && source.parentNode != null)
    {
        let childs = source.parentNode.childNodes;

        for(let i = 0; i < childs.length; i++)
        {
            let found = null;
            let child = childs[i];

            if(source.className == "hsep" && (child.className == "hdiv" || child.className == "h0div"))
            {
                found = child;
                top.addEventListener("mousemove",hmouseMove);
            }

            if(source.className == "vsep" && (child.className == "vdiv" || child.className == "v0div"))
            {
                found = child;
                top.addEventListener("mousemove",vmouseMove);
            }

            if(found != null)
            {
                if(top.div1 == null)
                {
                    top.div1 = child;
                }
                else
                {
                    top.div2 = child;
                }
            }
        }
    }

    return false;
}

function vmouseMove(e)
{
    let dpx = "% - 3px)";
    let top = document.getElementById("top");
    let rect = top.div1.parentNode.getBoundingClientRect();
    let my  = parseInt(e.clientY - rect.top);
    let prc = my * 100 / (rect.bottom - rect.top);

    if(prc > 1 && prc < 99)
    {
        top.div1.style.height = "calc(" + Math.round(prc) + dpx;
        top.div2.style.height = "calc(" + Math.round(100 - prc) + dpx;
    }

    return false;
}

function hmouseMove(e)
{
    let dpx = "% - 3px)";
    let top = document.getElementById("top");
    let rect = top.div1.parentNode.getBoundingClientRect();
    let mx  = parseInt(e.clientX - rect.left);
    let prc = mx * 100 / (rect.right - rect.left);

    if(prc > 1 && prc < 99)
    {
        top.div1.style.width = "calc(" + Math.round(prc) + dpx;
        top.div2.style.width = "calc(" + Math.round(100 - prc) + dpx;
    }

    return false;
}
