 /* jshint esversion: 6 */

function getCol(doc,val)
{
    if(val < 0.0)
    {
        val = 0.0;
    }
    else if(val >= 1.0)
    {
        val = doc.seglen - 0.0001;
    }
    else
    {
        val *= doc.seglen;
    }
    
    let id1 = Math.floor(val);
    let id2 = id1 + 1;

    let rval = doc.cols[id1][0] + (doc.cols[id2][0] - doc.cols[id1][0]) * (val - id1);
    let gval = doc.cols[id1][1] + (doc.cols[id2][1] - doc.cols[id1][1]) * (val - id1);
    let bval = doc.cols[id1][2] + (doc.cols[id2][2] - doc.cols[id1][2]) * (val - id1);
    let bin = rval << 16 | gval << 8 | bval;
    let str = bin.toString(16).toUpperCase();
    return "#" + new Array(7-str.length).join("0")+str;
}

function setColorStop(doc,grad,min,max,prec)
{
    let col1 = getCol(doc,min);
    let col2 = getCol(doc,max);
    let fach = doc.seglen;
    let facl = doc.seglen - 0.0001;
    
    let minf = min * fach;
    let maxf = max * facl;

    if(grad == null || (maxf - minf) < doc.cols.length/prec)
    {
        return getCol(doc,(min+max)/2);
    }

    let minr = Math.ceil(minf);
    let maxr = Math.floor(maxf);

    grad.addColorStop(0.0,col1);
    
    for(let r = minr; r <= maxr; r++)
    {
        let act = (r/fach-min)/(max-min);
        grad.addColorStop(act,doc.rgb[r]);
    }

    grad.addColorStop(1.0,col2);

    return null;
}
                        
function renderGraph(top,canvas,mode)
{
    let ax = canvas.ax;
    let ay = canvas.ay;
    let sx = canvas.sx;
    let sy = canvas.sy;
    let cx = canvas.width /2;
    let cy = canvas.height/1.8;
    let pr = 20.0;

    if( navigator.userAgent.toLowerCase().indexOf('firefox') > -1 )
    {
        pr = 8.0;
    }

    if(canvas.zo == 1 && canvas.ox == 0 && canvas.oy == 0)
    {
        canvas.zo = 20;
    }

    if(canvas.zo < 5)
    {
        canvas.zo = 5;
        return;
    }

    let zo = canvas.zo / 3;

    let fill00 = "#000000";
    let fill01 = "#000000";
    let fill02 = "#000000";
    let stroke = "#000000";

    if(top.laf == 0)
    {
        lwidth = 0.02 * zo;
        fill00 = "#F0F0FF";
        fill01 = "#D0D0DD";
        fill02 = "#9090ff";
        stroke = "#000090";

        if(lwidth > 0.2)
        {
            lwidth = 0.2;
        }
    }
    else
    {
        lwidth = 0.04 * zo;
        fill00 = "#404050";
        fill01 = "#101050";
        fill02 = "#501010";
        stroke = "#ffffff";

        if(lwidth > 0.5)
        {
            lwidth = 0.5;
        }
    }

    let ctx = canvas.getContext("2d");
    
    ctx.font        = "10px Helvetica";
    ctx.lineWidth   = lwidth;
    ctx.fillStyle   = fill00;
    ctx.strokeStyle = stroke;
    ctx.globalAlpha = 1.0;
    
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let data = canvas.data;
    let view = canvas.view;
    let flen = data.length;
    let xsin = Math.sin(ax);
    let ysin = Math.sin(ay);
    let xcos = Math.cos(ax);
    let ycos = Math.cos(ay);
    let half = Math.floor(flen/2);
    let px = [0.5,-0.5,-0.5, 0.5, 0.5];
    let pz = [0.5, 0.5,-0.5,-0.5, 0.5];

    let x1 = 0;
    let x2 = 0;
    let z1 = 0;
    let z2 = 0;
    let ps = 3;
    let ro = canvas.ro;

    if(Math.abs(canvas.ax) < 0.1)
    {
        ps = 10000;
    }

    switch(ro)
    {
        case 0:
            x1 = 0;z1 = flen-1;x2 = 0;z2 = 0;
            break;
        case 1:
            x1 = 0;z1 = flen-1;x2 = flen-1;z2 = flen-1;
            break;
        case 2:
            x1 = flen-1;z1 = flen-1;x2 = 0;z2 = flen-1;
            break;
        case 3:
            x1 = flen-1;z1 = flen-1;x2 = flen-1;z2 = 0;
            break;
        case 4:
            x1 = flen-1;z1 = 0;x2 = flen-1;z2 = flen-1;
            break;
        case 5:
            x1 = flen-1;z1 = 0;x2 = 0;z2 = 0;
            break;
        case 6:
            x1 = 0;z1 = 0;x2 = flen-1;z2 = 0;
            break;
        case 7:
            x1 = 0;z1 = 0;x2 = 0;z2 = flen-1;
            break;
    }

    let dx1 = Math.sign(x2 - x1);
    let dz1 = Math.sign(z2 - z1);
    let dx2 = 0;
    let dz2 = 0;

    if(dz1 == 0)
    {
        if(z1 == 0)
        {
            dz2 = 1;
        }
        else
        {
            dz2 = -1;
        }
    }

    if(dx1 == 0)
    {
        if(x1 == 0)
        {
            dx2 = 1;
        }
        else
        {
            dx2 = -1;
        }
    }

    let glbmin = data[0][0];
    let glbmax = data[0][0];
    let fsize  = flen * flen;

    for(let x = 0; x < flen; x++)
    {
        let xm = x;
        if(x == flen-1) xm = flen-2;
        else if(x == 0) xm = 1;

        for(let z = 0; z < flen; z++)
        {
            let zm = z;
            if(zm == flen-1) zm = flen-2;
            else if(zm == 0) zm = 1;

            let dt = data[z][x];
            let xr = (half - xm) * zo;
            let zr = (half - zm) * zo;
            let yr = dt * zo;

            let zs = xr * ycos - zr * ysin;
            let xs = xr * ysin + zr * ycos;
            
            zr = zs;
            
            let ys =  zr * xcos - yr * xsin;
            zs     = -yr * xcos - zr * xsin;
            let vw =  cx  / (cx + zs / ps);
            
            xs = (xs * vw + cx) - sx;
            ys = (cy - ys * vw) * 0.9 + sy;

            view[x][z][0] = xs;
            view[x][z][1] = ys;

            if(glbmin > dt)
            {
                glbmin = dt;
            }

            if(glbmax < dt)
            {
                glbmax = dt;
            }
        }
    }

    let x = x1;
    let z = z1;

    for(let i = 0; i < fsize; i++)
    {
        let skip = 0;
        let tx = x + dx1 + dx2;
        let tz = z + dz1 + dz2;

        if(mode == 0 && ((x+z) % 2 == 0))
        {
            skip = 1;
        }

        if(skip == 0 && tx >= 0 && tx <= flen-1 && tz >= 0 && tz <= flen-1)
        {
            ctx.beginPath();
            ctx.moveTo(view[x][z][0],view[x][z][1]);
            ctx.lineTo(view[x+dx1][z+dz1][0],view[x+dx1][z+dz1][1]);
            ctx.lineTo(view[x+dx1+dx2][z+dz1+dz2][0],view[x+dx1+dx2][z+dz1+dz2][1]);
            ctx.lineTo(view[x+dx2][z+dz2][0],view[x+dx2][z+dz2][1]);
            ctx.lineTo(view[x][z][0],view[x][z][1]);

            if(mode == 1)
            {
                let dat1 = data[z+dz1][x+dx1];
                let dat2 = data[z+dz2][x+dx2];
                let dat3 = data[z+dz1+dz2][x+dx1+dx2];
                let xmin = view[x][z][0];
                let ymin = view[x][z][1];
                let xmax = view[x][z][0];
                let ymax = view[x][z][1];
                let vmin = data[z][x];
                let vmax = data[z][x];

                if(dat1 > vmax)
                {
                    vmax = dat1;
                    xmax = view[x+dx1][z+dz1][0];
                    ymax = view[x+dx1][z+dz1][1];
                }

                if(dat1 < vmin)
                {
                    vmin = dat1;
                    xmin = view[x+dx1][z+dz1][0];
                    ymin = view[x+dx1][z+dz1][1];
                }

                if(dat2 > vmax)
                {
                    vmax = dat2;
                    xmax = view[x+dx2][z+dz2][0];
                    ymax = view[x+dx2][z+dz2][1];
                }

                if(dat2 < vmin)
                {
                    vmin = dat2;
                    xmin = view[x+dx2][z+dz2][0];
                    ymin = view[x+dx2][z+dz2][1];
                }

                if(dat3 > vmax)
                {
                    vmax = dat3;
                    xmax = view[x+dx1+dx2][z+dz1+dz2][0];
                    ymax = view[x+dx1+dx2][z+dz1+dz2][1];
                }

                if(dat3 < vmin)
                {
                    vmin = dat3;
                    xmin = view[x+dx1+dx2][z+dz1+dz2][0];
                    ymin = view[x+dx1+dx2][z+dz1+dz2][1];
                }

                let grad = null;;

                let span = glbmax - glbmin;
                let from = (vmin-glbmin)/span;
                let untl = (vmax-glbmin)/span;
                let diff = Math.abs(xmax-xmin) + Math.abs(ymax-ymin);

                if(diff > 10 ||
                   xmin < 0 && xmax < 0 || xmin > canvas.width  && xmax > canvas.width ||
                   ymin < 0 && ymax < 0 || ymin > canvas.height && ymax > canvas.height )
                {
                    grad = ctx.createLinearGradient(xmin,ymin,xmax,ymax);
                }

                let unic = setColorStop(canvas,grad,from,untl,pr);

                if(unic != null)
                {
                    ctx.fillStyle = unic;
                }
                else
                {
                    ctx.fillStyle = grad;
                }

                ctx.fill();
            }
                
            ctx.stroke();
        }

        let xlbl = canvas.ylbl[x];
        let ylbl = canvas.xlbl[z];

        if(ro == 1 || ro == 2 || ro == 5 || ro == 6)
        {
            xlbl = canvas.xlbl[z];
            ylbl = canvas.ylbl[x];            
        }

        x += dx1;
        z += dz1;
        
        if(i >= flen * (flen-1) && i < flen*flen && ylbl != "")
        {
            let ox = view[x-dx1][z-dz1][0];
            let oy = view[x-dx1][z-dz1][1];
            let dx = ox-view[x-dx1-dx2*(flen-1)][z-dz1-dz2*(flen-1)][0];
            let dy = oy-view[x-dx1-dx2*(flen-1)][z-dz1-dz2*(flen-1)][1];

            dx /= flen;
            dy /= flen;
            
            if(mode == 1 && zo > 8)
            {
                ctx.beginPath();
                ctx.moveTo(ox+dx,oy+dy);
                ctx.lineTo(ox+2*dx,oy+2*dy);
                ctx.stroke();

                ctx.save();
                ctx.translate(ox+2*dx-2,oy+2*dy+2);
                ctx.rotate(Math.PI/2);
                ctx.fillStyle = ctx.strokeStyle;
                ctx.fillText(ylbl,0,0);
                ctx.restore();
            }
        }

        if((i+1) % flen == 0)
        {
            if(xlbl != "")
            {
                let xoff = -2;
                let ox = view[x-dx1][z-dz1][0];
                let oy = view[x-dx1][z-dz1][1];
                let dx = ox-view[x-dx1*flen][z-dz1*flen][0];
                let dy = oy-view[x-dx1*flen][z-dz1*flen][1];

                dx /= flen;
                dy /= flen;
            
                if(dx < 0)
                {
                    xoff -= xlbl.length * 6;
                }

                if(mode == 1 && zo > 8)
                {
                    ctx.beginPath();
                    ctx.moveTo(ox+dx,oy+dy);
                    ctx.lineTo(ox+2*dx,oy+2*dy);
                    ctx.stroke();           
                    ctx.fillStyle = ctx.strokeStyle;
                    ctx.fillText(xlbl,xoff+ox+2*dx,oy+2*dy+4);
                }
            }

            if(dx2 == 0)
            {
                x = x1;
                z += dz2;
            }
            
            if(dz2 == 0)
            {
                z = z1;
                x += dx2;
            }
        }
    }
}

function createHeatMapChart(parent)
{
    let doc = document.createElement("CANVAS");

    parent.appendChild(doc);

    doc.ifcback = function(doc,obj)
    {   
        flen = obj.flen;
        doc.data = obj.heat;
        doc.xlbl = obj.xlbl;
        doc.ylbl = obj.ylbl;

        doc.view = new Array(flen);

        for(let x = 0; x < flen; x++)
        {
            doc.view[x] = new Array(flen);

            for(let z = 0; z < flen; z++)
            {
                doc.view[x][z] = new Array(2);
            }
        }

        doc.render(doc,1);
    }
        
    doc.cols =
    [
        [140,220,20],
        [201,211,60],
        [231,176,49],
        [254,138,55],
        [254,108,83],
        [255,84,118],
        [239,68,147],
        [203,59,172],
        [156,61,179],
        [108,64,165]
    ];

    doc.rgb = [];
    doc.seglen = doc.cols.length - 1; 

    for(let r = 0; r < doc.cols.length; r++)
    {
        let rval = doc.cols[r][0];
        let gval = doc.cols[r][1];
        let bval = doc.cols[r][2];
        let bin = rval << 16 | gval << 8 | bval;
        let str = bin.toString(16).toUpperCase();
        doc.rgb[r] = "#" + new Array(7-str.length).join("0")+str;     
    }

    initCanvas(doc,renderGraph);

    data = {}
    data["len"] = 60

    ifcjson("type_heat",data,parent);

    return doc;
}

function renderHeatMapChart(doc,mode)
{
    doc.render(doc,1);
}
