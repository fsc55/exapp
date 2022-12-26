
function initParams(canvas)
{
    canvas.mb = 0;
    canvas.mx = 0;
    canvas.my = 0;
    canvas.ox = 0;
    canvas.oy = 0;
    canvas.sx = 0;
    canvas.sy = 0;
    canvas.tm = 0;
    canvas.ro = 3;
    canvas.zo = 1;
    canvas.ax = 0.0;
    canvas.ay = 3.141;    
}

function initCanvas(canvas,customRender)
{
    initParams(canvas)

    canvas.canvasMouseDown = function(event)
    {
        event.preventDefault();
    
        if(event.button == 0)
        {
            let canvas = event.target;
    
            canvas.mb = 1;
        }
    }
    
    canvas.canvasMouseOut = function(event)
    {
        event.preventDefault();
    
        let canvas = event.target;
    
        canvas.mb = 0; 
    }
    
    canvas.canvasMouseUp = function(event)
    {
        event.preventDefault();
    
        let canvas = event.target;
    
        if(canvas.mb == 1)
        {
            canvas.render(canvas,1);
        }
        
        canvas.mb = 0;
    }
    
    canvas.canvasMouseMove = function(event)
    {
        event.preventDefault();
    
        let top = document.getElementById("top");
    
        let dpr = 1;
        let canvas = event.target;
        let rect = canvas.getBoundingClientRect();
    
        canvas.mx  = parseInt(event.clientX - rect.left) * dpr;
        canvas.my  = parseInt(event.clientY - rect.top)  * dpr;
    
        if(canvas.mb > 0 && canvas.ox != 0 && canvas.oy != 0)
        {
            canvas.mb = 2;
    
            if(top.keyCode == 16 || top.shiftLock == 1)
            {
                let cy = canvas.height/2.5;
                let dx = canvas.ox - canvas.mx;
                let dy = canvas.my - canvas.oy;
    
                if(canvas.my - canvas.sy < cy)
                {
                    dx = -dx;
                }
    
                if(canvas.ax < -1.6)
                {
                    dx = -dx;
                }
    
                canvas.ay += dx / 400.0;
                canvas.ax += dy / 200.0;
    
                angle = Math.floor(canvas.ay * 8 / 6.282) % 8;
    
                if(angle < 0)
                {
                    angle = 8 + angle;
                }
    
                canvas.ro = Math.abs(angle);
    
                if(canvas.ax > 0.0)
                {
                    canvas.ax = -0.01;
                }
    
                if(canvas.ax < -3.141)
                {
                    canvas.ax = -3.141;
                }
            }
            else
            {
                canvas.sx += (canvas.ox - canvas.mx);
                canvas.sy += (canvas.my - canvas.oy);
            }
    
            canvas.render(canvas,0);
        }
    
        canvas.ox = canvas.mx;
        canvas.oy = canvas.my;
    }
    
    canvas.canvasCheckRefresh = function(canvas)
    {
        if(canvas.wrf == 1)
        {
            canvas.wrf = 0;
            setTimeout (function() {canvas.canvasCheckRefresh(canvas);},100);
        }
        else
        {
            canvas.render(canvas,1);
            canvas.tm = 0;
        }
    }
    
    canvas.canvasMouseWheel = function (event)
    {
        event.preventDefault();

        let canvas = event.target;
    
        if((event.wheelDelta > 0 || event.detail < 0) && canvas.zo < 100)
        {
            canvas.zo *= 1.03;
            canvas.sx *= 1.03;
            canvas.sy *= 1.03;

            canvas.render(canvas,0);
            canvas.wrf = 1;
    
            if(canvas.tm == 0)
            {
                canvas.tm = 1;
                setTimeout (function() {canvas.canvasCheckRefresh(canvas);},100);
            }
        }
    
        if(event.wheelDelta < 0 || event.detail > 0)
        {
            if(canvas.zo > 0.3)
            {
                canvas.zo *= 0.97;
            }

            canvas.sx *= 0.97;
            canvas.sy *= 0.97;

            canvas.render(canvas,0);
            canvas.wrf = 1;
    
            if(canvas.tm == 0)
            {
                canvas.tm = 1;
                setTimeout (function() {canvas.canvasCheckRefresh(canvas);},100);
            }
        }
    }

    canvas.addEventListener("mousewheel",     canvas.canvasMouseWheel);
    canvas.addEventListener("DOMMouseScroll", canvas.canvasMouseWheel);
    canvas.addEventListener("mouseup",        canvas.canvasMouseUp);
    canvas.addEventListener("mousedown",      canvas.canvasMouseDown);
    canvas.addEventListener("mousemove",      canvas.canvasMouseMove);
    canvas.addEventListener("mouseout",       canvas.canvasMouseOut);

    canvas.render = function (canvas,mode)
    {
        let dpr = 1;
    
        if(Math.abs(canvas.width  - canvas.parentNode.clientWidth*dpr ) > 1 ||
           Math.abs(canvas.height - canvas.parentNode.clientHeight*dpr) > 1  )
        {
            canvas.width  = canvas.parentNode.clientWidth  * dpr;
            canvas.height = canvas.parentNode.clientHeight * dpr;
            canvas.style.width  = canvas.parentNode.clientWidth  + "px";
            canvas.style.height = canvas.parentNode.clientHeight + "px";
        }
    
        let top = document.getElementById("top");
    
        if(top == null)
        {
            return;
        }
    
        let ctx = canvas.getContext("2d");
    
        customRender(top,canvas,mode);
    
        if(top.laf == 0)
        {
            ctx.strokeStyle = "#AAAAAA";
        }
        else
        {  
            ctx.strokeStyle = "#282438";
        } 
    
        ctx.lineWidth=6; 
        ctx.beginPath(); 
        ctx.arc(canvas.width-5,canvas.height-5,8,0.5,Math.PI*0.4);
        ctx.arc(5,canvas.height-5,8,Math.PI*0.6,Math.PI*0.9);
        ctx.arc(5,5,8,Math.PI,Math.PI*1.5);
        ctx.arc(canvas.width-5,5,8,Math.PI*1.5,Math.PI*2);
        ctx.stroke();
    }
}
