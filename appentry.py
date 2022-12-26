from waitress import serve
from flask import Flask
from flask import render_template
from flask import request
from flask import Response
import logging
import base64
import json
import time
import gzip
import sys
import os

import heatmap

aorigin = '*'

#----------

def checkauth(auth):
    vec = auth.split()
    if(vec != None and len(vec) == 2):
        logging.info(base64.b64decode(vec[1]).decode("utf-8"))
    return True

class MsgObj:
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,sort_keys=True)

app = Flask(__name__)

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

@app.route('/ifcjson', methods = ['GET','POST','OPTIONS'])

def ifcjson():
    if request.method == 'OPTIONS':
        logging.info("OPT")
        resp = Response("")
        resp.headers['Access-Control-Allow-Origin']  = aorigin
        resp.headers['Access-Control-Allow-Methods'] = 'POST, GET'
        resp.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
        return resp
    
    if request.method == 'GET':
        return "ifcjson get received"

    if request.method == 'POST':
        logging.info("POST:jsonin")
        auth = request.headers.get("Authorization")
        if(checkauth(auth) == False):
            type = "auth_err"

        tm1 = time.time()
        back = MsgObj()
        pobj = request.json
        type = pobj["type"]
        leaf = pobj["leaf"]
        data = pobj["data"]
        back.type = type
        back.leaf = leaf
                      
        if(type == "type_heat"):
            heatmap.calculateHeatmap(data,back)
            resp = Response(gzip.compress(back.toJSON().encode(),1))
            resp.headers['Access-Control-Allow-Origin']  = aorigin
            resp.headers['Content-Encoding']  = 'gzip'
            tm2 = (int)((time.time() - tm1) * 1000)
            logging.info("HEAT:"+str(tm2)+"\n")
            return resp

        elif(type == "auth_err"):
            back.type = "auth_err"
            resp = Response(gzip.compress(back.toJSON().encode(),1))
            resp.headers['Access-Control-Allow-Origin']  = aorigin
            resp.headers['Content-Encoding']  = 'gzip'
            tm2 = (int)((time.time() - tm1) * 1000)
            logging.info("AUTH_ERR:"+str(tm2)+"\n")
            resp.status_code = 401
            return resp

        else:
            back.type = "err"
            resp = Response(gzip.compress(back.toJSON().encode(),1))
            resp.headers['Access-Control-Allow-Origin']  = aorigin
            resp.headers['Content-Encoding']  = 'gzip'
            tm2 = (int)((time.time() - tm1) * 1000)
            logging.info("ERR:"+str(tm2)+"\n")
            resp.status_code = 404
            return resp

#----------

def init_app():
    logging.basicConfig(format='%(levelname)s:%(message)s',stream=sys.stdout,level=logging.INFO)
    logging.info("started")

#----------

@app.route('/')

def index():
    return render_template('index.html')

#----------

def main():
    init_app()

    servport = int(os.getenv('PORT', 8080))
    
    #waitress use
    serve(app, host='0.0.0.0', port=servport)

    #flask only: 
    #app.run(host='0.0.0.0',port=servport)

#----------

if __name__ == "__main__":
    main()
