import math

def calculateHeatmap(input,output):
    flen = input["len"]+2
    heat = [None] * flen
    xlbl = [None] * flen
    ylbl = [None] * flen

    for x in range(flen):
        heat[x] = [None] * flen
        if(x > 0 and x < flen-1):
            xlbl[x] = f" X {x-1:02d}"
        else:
            xlbl[x] = "";

        for z in range(flen):
            if(z > 0 and z < flen-1):
                ylbl[z] = f" Y {z-1:02d}"
            else:
                ylbl[z] = ""

            vx = x / 15
            vz = z / 15
            val = math.pow(math.sin(vx),10) + math.cos(10+vx*vz) * math.cos(vx)
            val *= 5
            val += 5

            if(x == 0 or x == flen-1 or z == 0 or z == flen-1):
                val = 0;
            
            heat[x][z] = val;

    output.flen = flen
    output.heat = heat
    output.xlbl = xlbl
    output.ylbl = ylbl

