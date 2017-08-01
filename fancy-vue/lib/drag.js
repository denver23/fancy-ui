/**************************************************
 * dom-drag.js
 **************************************************/
var Drag = {
  obj: null,
  init(o, oRoot, minX, maxX, minY, maxY) {
    o.onmousedown = Drag.start;
    o.root = oRoot && oRoot != null ? oRoot : o;
  },
  start(e) {
    var o = Drag.obj = this;
    e = Drag.fixE(e);

    if (!o.root.style.top || o.root.style.top.indexOf('%') >= 0) o.root.style.top = o.root.offsetTop + 'px';
    if (!o.root.style.left || o.root.style.left.indexOf('%') >= 0) o.root.style.left = o.root.offsetLeft + 'px';

    var y = parseInt(o.root.style.top);
    var x = parseInt(o.root.style.left);

    o.lastMouseX = e.clientX;
    o.lastMouseY = e.clientY;

    document.onmousemove = Drag.drag;
    document.onmouseup = Drag.end;

    return false;
  },
  drag(e) {
    e = Drag.fixE(e);
    var o = Drag.obj;

    var ey = e.clientY;
    var ex = e.clientX;
    var y = parseInt(o.root.style.top);
    var x = parseInt(o.root.style.left);
    var nx, ny;

    nx = x + ex - o.lastMouseX;
    ny = y + ey - o.lastMouseY;

    Drag.obj.root.style.left = nx + "px";
    Drag.obj.root.style.top = ny + "px";
    Drag.obj.lastMouseX = ex;
    Drag.obj.lastMouseY = ey;

    return false;
  },
  end() {
    document.onmousemove = null;
    document.onmouseup = null;
    Drag.obj = null;
  },
  fixE(e) {
    if (typeof e == 'undefined') e = window.event;
    if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
    if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
    return e;
  }
};

export default Drag;
