
const Util = {
  getQueryAll() {
    let res = {};
    let str = window.location.search.substr(1);
    str != null && str.replace(/([^=&]+)=([^&]*)/g, (all, key, value) => {
      value && (res[key] = decodeURIComponent(value));
    });
    return res;
  },
  getQuery(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    return r != null ? decodeURIComponent(r[2]) : '';
  },
  getCookie(name) {
    name = PREFIX + 'name';
    let s = document.cookie.indexOf(name);
    let e = document.cookie.indexOf(";", s);
    return s == -1 ? '' : decodeURIComponent(document.cookie.substring(s + name.length + 1, (e > s ? e : document.cookie.length)));
  },
  setCookie(name, value, seconds, path, domain, secure) {
    name = PREFIX + 'name';
    seconds = seconds ? seconds : 3600000;
    let expires = new Date();
    expires.setTime(expires.getTime() + seconds);
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) +
      (expires ? '; expires=' + expires.toUTCString() : '') +
      (path ? '; path=' + path : '/') +
      (domain ? '; domain=' + domain : '') +
      (secure ? '; secure' : '');
  },
  //截取汉字
  /*String.prototype.substr2 = function(a,b){
    let s = this.replace(/([^\x00-\xff])/g,"\x00$1");
    return(s.length<b) ? this : s.substring(a,b).replace(/\x00/g,'');
  }*/
  // 字符串截取 dot 补充字符
  subString(str, len, dot) {
    let i = 0,
      cn = /[^\x00-\xff]/g,
      strLen = str.replace(cn, "**").length,
      newLen = 0,
      newStr = '',
      tmpChar = '';

    for (; i < strLen; i++) {
      tmpChar = str.charAt(i).toString();
      if (tmpChar.match(cn) != null) {
        newLen += 2;
      } else {
        newLen++;
      }
      if (newLen > len) {
        break;
      }
      newStr += tmpChar;
    }
    if (dot && strLen > len) {
      newStr += dot;
    }
    return newStr;
  },
  // 生成随机id
  mkRid(n) {
    let a = [];
    a[n || 8] = '';
    return a.join('x').replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  urlhttp(url) {
    return url.replace(/^http(s?):/i, '');
  },
  loadJs(src, callback) {
    if (Array.isArray(src)) {
      if (src.length > 1) return this.loadJs(src.shift(), () => this.loadJs(src, callback));
      return this.loadJs(src[0], callback);
    }
    let script = document.createElement('script');
    script.src = src;
    // script.setAttribute('async', 'async')
    document.getElementsByTagName('head')[0].appendChild(script);
    if (callback) script.onload = callback;
  },
  loadCss(cfg) {
    let head = document.getElementsByTagName('head')[0];
    if (cfg.content) {
      let sty = document.createElement('style');
      sty.type = 'text/css';
      // IE
      if (sty.styleSheet) sty.styleSheet.cssText = cfg.content;
      else sty.innerHTML = cfg.content;
      head.appendChild(sty);
    } else if (cfg.url) {
      let link = document.createElement('link');
      link.href = cfg.url;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      head.appendChild(link);
    }
  },
  /**
   * CSS3 3D转换
  function transform(x, y, z){
    x = x || 0;
    y = y || 0;
    z = z || 0;
    let value = 'translate3d('+ x +','+ y +','+ z +')';
    return {
      '-webkit-transform' :value ,
      '-moz-transform' : value,
      '-o-transform' : value,
      'transform' : value
    }
  }
  */

  // 订单状态
  BILL_STATUS: [{
    value: 0,
    label: '未付款',
    color: 'red'
  }, {
    value: 1,
    label: '已付款',
    color: 'green'
  }, {
    value: 2,
    label: '过期未取',
    color: '#999'
  }, {
    value: 3,
    label: '已退款',
    color: '#999'
  }, {
    value: 4,
    label: '已出票',
    color: '#999'
  }, {
    value: 5,
    label: '申请退款',
    color: '#f60'
  }, {
    value: -1,
    label: '已取消',
    color: '#999'
  }],
  // 阿里支付类型
  ALIPAY_TYPES: [{
      value: 'aliPay',
      label: '支付宝'
    }, {
      value: 'CMB',
      label: '招商银行'
    }, {
      value: 'ICBC-DEBIT',
      label: '工商银行'
    }, {
      value: 'CCB',
      label: '建设银行'
    }, {
      value: 'COMM-DEBIT',
      label: '交通银行'
    }, {
      value: 'BOCB2C',
      label: '中国银行'
    }, {
      value: 'CIB',
      label: '兴业银行'
    }, {
      value: 'CEBBANK',
      label: '光大银行'
    }, {
      value: 'SPDB',
      label: '浦发银行'
    }, {
      value: 'GDB',
      label: '广发银行'
    }, {
      value: 'CITIC',
      label: '中信银行'
    },
    //{ value : 'CMBC' ,      label : '民生银行' },
    {
      value: 'SPABANK',
      label: '平安银行'
    }, {
      value: 'POSTGC',
      label: '邮政储蓄银行'
    }, {
      value: 'BJBANK',
      label: '北京银行'
    },
    //{ value : 'BJRCB' ,     label : '北京农商银行' },
    //{ value : 'ABC' ,       label : '农业银行' }
  ],
}

export default Util;
