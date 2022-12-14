/*
  popupmenu.js - simple JavaScript popup menu library.

  Copyright (C) 2006 Jiro Nishiguchi <jiro@cpan.org> All rights reserved.
  This is free software with ABSOLUTELY NO WARRANTY.

  You can redistribute it and/or modify it under the modified BSD license.

  Usage:
    var popup = new PopupMenu();
    popup.add(menuText, function(target){ ... });
    popup.addSeparator();
    popup.bind('targetElement');
    popup.bind(); // target is document;
*/
var PopupMenu = function() {
  this.init();
}
PopupMenu.TEXT      = '#PopupMenu.TEXT';
PopupMenu.SEPARATOR = '#PopupMenu.SEPARATOR';
PopupMenu.SELECTOR  = '#PopupMenu.SELECTOR';
PopupMenu.current = null;
PopupMenu.addEventListener = function(element, name, observer, capture) {
  if (typeof element == 'string') {
      element = document.getElementById(element);
  }
  if (element.addEventListener) {
      element.addEventListener(name, observer, capture);
  } else if (element.attachEvent) {
      element.attachEvent('on' + name, observer);
  }
};
PopupMenu.prototype = {
  init: function() {
      this.items  = [];
      this.width  = 0;
      this.height = 0;
      this.elemno = 0;
  },
  setSize: function(width, height) {
      this.width  = width;
      this.height = height;
      if (this.element) {
          var self = this;
          with (this.element.style) {
              if (self.width)  width  = self.width  + 'px';
              if (self.height) height = self.height + 'px';
          }
      }
  },
  bind: function(element) {
      var self = this;
      if (!element) {
          element = document;
      } else if (typeof element == 'string') {
          element = document.getElementById(element);
      }
      this.target = element;
      this.target.oncontextmenu = function(e) {
          self.show.call(self, e);
          return false;
      };
      var listener = function() {self.hide.call(self)};
      PopupMenu.addEventListener(document, 'click', listener, true);
    },
  add: function(text, callback) {
      this.items.push({typ: PopupMenu.TEXT, data: text, callback: callback});
  },
  addSelector: function(sel, callback) {
      this.items.push({typ: PopupMenu.SELECTOR, data: sel, callback: callback});
  },
  addSeparator: function() {
      this.items.push({typ: PopupMenu.SEPARATOR});
  },
  setPos: function(e) {
      if (!this.element) return;
      if (!e) e = window.event;
      var x, y;
      if (window.opera) {
          x = e.clientX;
          y = e.clientY;
      } else if (document.all) {
          x = document.body.scrollLeft + event.clientX;
          y = document.body.scrollTop + event.clientY;
      } else if (document.layers || document.getElementById) {
          x = e.pageX;
          y = e.pageY;
      }
      if(x > 100)
      {
          x -= 50;
      }
      
      if(x > document.body.clientWidth - 100)
      {
          x -= 50;
      }
      
      let height = this.elemno * 18;
      
      if(y > document.body.clientHeight - height)
      {
          y -= height;
      }
      
      this.element.style.top  = y + 'px';
      this.element.style.left = x + 'px';
  },
  show: function(e) {
      if (PopupMenu.current && PopupMenu.current != this) return;
      PopupMenu.current = this;
      if (this.element) {
          this.setPos(e);
          this.element.style.display = '';
      } else {
          this.element = this.createMenu(this.items);
          this.setPos(e);
          document.body.appendChild(this.element);
      }
  },
  hide: function() {
      PopupMenu.current = null;
      if (this.element) this.element.style.display = 'none';
  },
  intChange: function(event) {
      event.target.exchange(event);
      event.target.selectedIndex = -1;
  },
  createMenu: function(items) {
      var self = this;
      var menu = document.createElement('div');
      with (menu.style) {
          if (self.width)  width  = self.width  + 'px';
          if (self.height) height = self.height + 'px';
          border       = "1px solid slategrey";
          borderRadius = '6px';
          font         = "13px courier new";
          background   = '#282438';
          color        = '#FFFFFF';
          position     = 'absolute';
          display      = 'block';
          padding      = '2px';
          cursor       = 'default';
          zIndex       = 999;
      }
      for (var i = 0; i < items.length; i++) {
        var item;
        if (items[i].typ == PopupMenu.SEPARATOR)
        {
            item = this.createSeparator();
        }
        else if(items[i].typ == PopupMenu.SELECTOR)
        {
            item = this.createSelector(items[i]);
        }        
        else
        {
            item = this.createItem(items[i]);
        }
        menu.appendChild(item);
      }
      return menu;
  },
  createSelector: function(item) {
    var sel = document.createElement("select");
    sel.id               = "popupsid"
    sel.size             =  4;
    sel.style.background = 'black';
    sel.style.color      = '#FFFFFF';
    sel.style.width      = '105px';
    sel.style.font       = '13px courier new';

    arr = item.data;

    for (var i = 0; i < arr.length; i++)
    {
        var option = document.createElement("option");
        sel.appendChild(option);

        option.value = arr[i];
        option.text  = arr[i];
    }

    this.elemno += sel.size;

    sel.exchange = item.callback;
    sel.onchange = this.intChange;

    return sel;
  },
  createItem: function(item) {
      var self = this;
      var elem = document.createElement('div');
      elem.style.padding = '4px';
      if(item.typ == PopupMenu.TEXT)
      {
          elem.appendChild(document.createTextNode(item.data));
          var callback = item.callback;
          PopupMenu.addEventListener(elem, 'click', function(_callback) {
              return function() {
                  self.hide();
                  _callback(self.target);
              };
          }(callback), true);
          PopupMenu.addEventListener(elem, 'mouseover', function(e) {
              elem.style.background = '#801020';
          }, true);
          PopupMenu.addEventListener(elem, 'mouseout', function(e) {
              elem.style.background = '#282438';
          }, true);
      }
      this.elemno++;
      return elem;
  },
  createSeparator: function() {
      var sep = document.createElement('div');
      with (sep.style) {
          borderTop = '2px solid slategrey';
          fontSize  = '0px';
          height    = '0px';
      }
      return sep;
  }
};
