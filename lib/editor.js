// let blank  = function(){

// };
// let indexRound = function(){};
// let indexFont = function(){};

// if( DEBUG ){
//     blank = function(size = 10, $color) {
//        let bgcolor = 'rgba(204, 204, 204, 0.5)';
//        //- let canvas= document.getElementById('canvas');
//        let canvas= document.createElement("canvas");

//        canvas.width  = size;
//        canvas.height = size;

//        let ctx = canvas.getContext("2d");
//        ctx.save();
//        ctx.clearRect(0, 0, size, size); //清空内容

//        ctx.fillStyle = bgcolor;
//        ctx.beginPath();
//        ctx.fillRect( 0, 0, size, size);
//        ctx.closePath();
//        ctx.fill();
//        return ctx.canvas.toDataURL();
//     };
//     // diameter 直径
//     // mount 数量
//     // bgcolor rgba 背景色
//     // font  字号
//     // color 字颜色
//     indexRound = function(diameter = 100, mount = 10, bgcolor, font = '14px Arial', color = '#35b5eb', number) {

//         bgcolor = bgcolor || 'rgba(204, 204, 204, 0.5)';
//         let canvas= document.createElement("canvas");
//         canvas.width = diameter * mount;
//         canvas.height = diameter * mount;

//         let x = diameter * mount - diameter / 2;
//         let y = diameter / 2;
//         let ctx = canvas.getContext("2d");
//         ctx.save();
//         ctx.clearRect(0, 0, canvas.width, canvas.height); //清空内容

//         for(let i = 0; i < mount; i++) {
//             ctx.fillStyle = bgcolor;
//             ctx.beginPath();
//             ctx.arc( x, y, diameter / 2, 0, Math.PI*2, true);
//             ctx.closePath();
//             ctx.fill();

//             ctx.fillStyle    = color;
//             ctx.font         = font;
//             ctx.textAlign    = "center";
//             ctx.textBaseline = "middle";
//             ctx.fillText(`No.${ mount == 1 ? number : (i+1)}`, x, y);
//             x -= diameter;
//             y += diameter;
//         }
//         return ctx.canvas.toDataURL();
//     };
//     indexFont = function(mount = 100, bgcolor, font = '18px Arial', color = '#35b5eb', number) {

//         let canvas= document.createElement("canvas");
//         let w = 70;
//         let h = 20;
//         canvas.width = w * mount;
//         canvas.height = h * mount;

//         let x = w * mount - w / 2;
//         let y = h / 2;
//         let ctx = canvas.getContext("2d");
//         ctx.save();
//         ctx.clearRect(0, 0, canvas.width, canvas.height); //清空内容

//         for(let i = 0; i < mount; i++) {
//             ctx.fillStyle    = color;
//             ctx.font         = font;
//             ctx.textAlign    = "center";
//             ctx.textBaseline = "middle";
//             ctx.fillText(`No.${ mount == 1 ? number : (i+1)}`, x, y);
//             x -= w;
//             y += h;
//         }
//         return ctx.canvas.toDataURL();
//     };
// }

const Editor = {
  filter (content, callback){
    return content.replace(/<([\w\-]+)([^>]*)>/gi, function (all, tag, attrs) {
      tag = tag.toLowerCase();
      tag = tag.replace(/h[\d]/,'p');

      if( ['script','style'].includes(tag)) return;
      attrs = attrs.replace(/([\w\-]*?)\s*=\s*(("([^"]*)")|('([^']*)')|([^\s>]+))/gi, function(str, attr, val){
        attr = attr.toLowerCase();
        if(['src','href','alt','title'].includes(attr)) return `${attr}=${val}`;
        return;
      });
      return '<'+ tag + (attrs ? ` ${attrs}` : '') +'>';
    })
    .replace(/[　]/g, '')                                   // full space
    .replace(/&nbsp;/g,'')
    .replace(/\n|\t/g, '')                                  // remove newline / carriage return
    .replace(/\s*</g, "<")                                  // remove whitespace before tags
    .replace(/>\s*/g, ">")                                  // remove whitespace after tags
    .replace(/(<br[^>]*>)+</g, "<")                         // remove段尾 <br>
    .replace(/>(<br[^>]*>)+/g, ">")                         // remove段首 <br>
    .replace(/<([^\s|td]+)(\s|td[^>]*)?>\s*<\/\1>/g,'')     // Remove empty tags
    .replace(/[ ]{2,}/g,' ')                                // whitespace merge
    .replace(/<table>/g,'<table class="content-table">')
    .replace(/div>/g,'p>')
    // 图片占位
    .replace(/####imgBegin####(.*?)####imgEnd####/g, function(all,attrs){
      return '<img'
          + attrs
            .replace(/src\s*=\s*(["'])(.*?)\1/, (str,mark,src) => 'src=""')
            .replace(/(width|height)\s*=\s*(["']?)(.*?)\2\s/g,(str,tag,mark,v) => `${tag}="${v}" `)
          + '>';
    })
    // 图片居中
    .replace(/<(p|div)[^>]*>\s*(<img[^>]*>)\s*<\/\1>/ig, (all, tag, img) => '<p style="text-align:center;text-indent:0">'+ img +'</p>')
    // 图片属性清理 回调
    .replace(/<img[^>]*>/ig, function(all){
      return all.replace(/\s*([\w\-]*?)\s*=\s*(['"])([^"]*)\2/ig, function (str, attr, mark, val) {
        attr = attr.toLowerCase();
        let res = ` ${attr}="${val}"`;
        if(['width','height','alt','id'].includes(attr)) return res;
        else if (attr === 'src') {
          let rid = 'rid-'+ Math.floor(Math.random() * 100000);
          if(callback && (val.includes('blob') || val.includes('data:image'))) callback(val,rid);
          return res + ` id="${rid}"`;
        }
        return;
      })
    })
  },
  getImage (content){
    let res = [];
    content && content.match(/<img.*?src="(.*?)"/ig).forEach( img => {
      res.push({ url: (/src="(.*?)"/ig.exec(img))[1]});
    });
    return res;
  }
}

export default Editor;
