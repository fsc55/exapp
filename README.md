# exapp
development kit for single page webapplications with builtin restful server communication

the kernel client part is implemented in javascript located in templates/static/basis

the kernel server part to demonstrate communication over restful interfaces in implemented
in python3 named appentry.py located in the root directory.

a sample control as 3D moveable heatmap is implemented as sample in templates/static/intern.
it is implemented based on canvas, but every other javascript compatible technologie can be used
to implement controls

the server sample which computes the heatmap contents is located in the root directory named heatmap.py

the server implementation needs python3 together with the flask and waitress library

if the server is used without a webserver like apache or nginx, please set a link named "static"
from the root directory pointing to templates/static.

then the server can be started directly via: python3 appentry.py
