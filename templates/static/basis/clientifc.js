/* jshint esversion: 6 */

let xh2tp = new XMLHttpRequest();

function ifcjson(type,data,leaf)
{
    let top  = document.getElementById("top");

    let lstr = "";

    if(leaf != null)
    {
        lstr = leaf.id;
    }

    let h2tpdest = window.location.origin + "/ifcjson";
    obj = {};
    if(data != null)
        obj.data = data;
    else
        obj.data = {};
    obj.type = type;
    obj.leaf = lstr;
    str = JSON.stringify(obj);
    xh2tp.open("Post", h2tpdest, true);
    xh2tp.setRequestHeader("Content-type","application/json");
    xh2tp.setRequestHeader("Authorization", "Basic " + btoa("myuser" + ":" + "mypasswd"));
    xh2tp.send(str);
}

function ifcform(form)
{
    let top  = document.getElementById("top");
    let h2tpdest = window.location.origin + "/ifcform";
    xh2tp.open("Post", h2tpdest, true);
    xh2tp.setRequestHeader("Authorization", "Basic " + btoa("myuser" + ":" + "mypasswd"));
    xh2tp.send(form);
}

xh2tp.onload = function()
{
    if(this.readyState == 4 && this.status == 200)
    {
        let obj = JSON.parse(this.responseText);

        if(obj.type != null && obj.type != "err")
        {
            if(obj.type == "type_dld" && obj.tok != null)
            { 
                 var element  = document.createElement('a');
                 element.setAttribute('href', window.location.origin + "/downloadf/" + obj.tok);
                 element.click();
            }
            else if(obj.leaf != "")
            {
                let leaf = document.getElementById(obj.leaf);

                if(leaf != null)
                {
                    let subw = leaf.parentNode;

                    if(subw != null && subw.doc != null)
                    {
                        subw.doc.ifcback(subw.doc,obj);
                    }
                } 
            }
        }
    }
};
