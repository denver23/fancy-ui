<!-- 焦点图 -->
<style lang="sass">
  @import "~fancy_style"

  .fancy-imgcrop
    &:focus
      outline: none
    &.fc-mask
      @include mixin-mask()
      > div
        position: absolute
        top: 50%
        left: 50%
        max-width: 100%
        max-height: 100%
        transform: translate3d( -50%, -50%, 0)
        overflow: auto
    > div
      padding: $space
      box-sizing: border-box
      background: #fff

    .fc-choose
      $w : 8rem
      margin-bottom: $space
      position: relative
      button,
      input
        display: inline-block
        width: $w
        height: $form-height
        line-height: normal
        background: $colorTheme
        border-radius: $borderRadius
        color: #fff
        border: none
      button
        &:hover,
        &:focus
          opacity: 0.6
      input[type="file"]
        opacity: 0
        cursor: pointer
        position: absolute
        left: 0
        top: 0
      select
        border: 1px solid $borderColor
        border-radius: $borderRadius
        height: $form-height
        padding-right: $space * 2
        margin: 0 0 0 $space
        &:focus
          border-color: $colorTheme
        &.fc-error
          animation: focusimgerr .3s ease alternate 2
          @keyframes focusimgerr
            0%,100%
              transform: translateX(0)
            25%
              transform: translateX(-10%)
            75%
              transform: translateX(10%)
        option
          padding: $space

    .fc-editor
      position: relative
      display: inline-block
      canvas
        &:nth-child(1)
          background: #fff
          border: 1px solid $borderColor
        &:nth-child(2)
          position: absolute
          top: 0
          left: 0
      span
        position: absolute
        z-index: 100
        top: 0
        right: $space
        background: rgba(#fff,0.5)
        .fa
          font-size: 1.5rem
          padding: 0.5rem
          color: $colorTheme
          &:hover
            color: $colorTheme

    .fc-btns
      padding: $space 0 0
      &.fc-loading
        button
          opacity: 0.6
          &:nth-child(2)
            background: $colorDisable
      button
        height: $form-height
        line-height: normal
        background: $colorTheme
        color: #fff
        border: 1px solid $colorTheme
        border-radius: $borderRadius
        display: inline-block
        width: 48%
        cursor: pointer
        &:nth-child(1)
          margin-right: 4%
        &:hover,
        &:focus
          opacity: 0.6
</style>

<template lang="pug">
  .fancy-imgcrop(v-show="state" tabindex="1" v-bind:class="{'fc-mask': mask}" @keydown="kdown($event)")
    div
      .fc-choose
        button(type="button" ref="btn" tabindex="1" @click="onChoose" @keydown.enter.stop="") 选择图片
        input(type="file" ref="file" tabindex="-1" autocomplete="off" @change="change")
        select(
          :class="{'fc-error':selectTips}"
          ref="select"
          v-if="data.length > 0"
          v-model="value"
          tabindex="3"
        )
          option(:value="v.value" v-for="v of data") {{v.label}}
      .fc-editor
        canvas(:style="window" ref="editor")
        canvas(:style="window" ref="croper" tabindex="10")
        span
          label.fa.fa-plus(@click="zoomInOut('in')")
          label.fa.fa-minus(@click="zoomInOut('out')")
          label.fa.fa-rotate-left(@click="turn(1)")
          label.fa.fa-rotate-right(@click="turn(-1)")
          //- label.fa.fa-arrow-up(@click="move('up')")
          //- label.fa.fa-arrow-right(@click="move('right')")
          //- label.fa.fa-arrow-down(@click="move('down')")
          //- label.fa.fa-arrow-left(@click="move('left')")
        .fc-btns(:class="{'fc-loading': state === 'loading'}")
          button(type="button" @click="submit" tabindex="5") 保存
          button(type="button" @click="cancel" tabindex="6") 取消
</template>

<script>

  import Platform from 'lib/platform.js';

  const origin = window.location.host;
  // const isTouchDevice = 'ontouchend' in document.documentElement;
  const isTouchDevice = Platform.isPhone;
  const evStart = isTouchDevice ? 'touchstart' : 'mousedown';
  const evMove = isTouchDevice ? 'touchmove' : 'mousemove';
  const evEnd = isTouchDevice ? 'touchend' : 'mouseup';

  function getClipboard(event){
    event.stopPropagation();
    event.preventDefault();
    if( event.clipboardData ){
      let items = event.clipboardData.items;
      if(items){
        for(let i = 0; i < items.length; i++) {
          if(items[i].type.indexOf("image") !== -1) {
            let URLObj = window.URL || window.webkitURL;
            let blob = items[i].getAsFile();
            return URLObj.createObjectURL(blob);
          }
        }
      }
    }
  }
  function isCrossOrigin(url){
    return /^(http|\/\/)/i.test(url) && url.indexOf(origin) == -1;
  }
  // let data = [
  //     {
  //         value : 1,
  //         label : 'test',
  //         size : {width : '300px', height : '300px'},
  //     },
  // ];
  const Options = {
    state    : '',
    src      : '',       // image url or src
    data     : [],
    value    : 0,
    fetchurl : '',       // image fetch
    mask     : true,
    window   : { width: '400px', height: '400px' },
    onSubmit (){},      //保存回调,base64图像编码，select值，图片大小
  };
  var image = new Image();

  export default {
    props: ['cfg'],
    data: () => Object.assign({}, Options, {
      source  : '',       // 图片源
      size    : '',
      zoom    : 1,        // 放大缩小
      rotate  : 0,        // 旋转
      offsetX : 0,        // X平移
      offsetY : 0,        // Y平移
      finder  : null,     // 取景器的值
      selectTips: false,
    }),
    mounted (){
      this.cfg && Object.assign(this.$data, this.cfg);
      this.$el.addEventListener("paste", this.onpaste);
    },
    watch: {
      cfg: {
        handler (val){
          Object.assign( this.$data, val );
        },
        deep: true
      },
      state (val){
        let db = document.querySelector('body');
        requestAnimationFrame(() => {
          if(val){
            this.$refs.btn.focus();
            db.style.overflow = 'hidden';
          }else{
            db.style.overflow = 'auto';
          }
        });
      },
      src (val){
        if(isCrossOrigin(val)) this.getCrossOrign(val);
        else this.source = val;
      },
      size (){
        image.src && this.drawEditor();
      },
      data (val){
        val.length && this.dragEvent();
      },
      source (val){
        image.src = val;
        image.onload = () => this.drawEditor();
        this.$refs.croper.focus();
      },
      zoom (){ this.drawEditor();},           // 缩放
      rotate (){ this.drawEditor();},         // 旋转
      offsetX (){ this.drawEditor();},        // 平移
      offsetY (){ this.drawEditor();},        // 平移
    },
    computed: {
      size (){
        let res = null;
        this.data.forEach((item) => {
          if(item.value == this.value) res = item.size;
        });
        return res  || this.window;
      },
    },
    methods: {
      kdown (e){
        if([13,27,37,38,39,40,99,100,101,187,189].includes(e.keyCode))
        {
          e.preventDefault();
          e.stopPropagation();
          // enter
          if([13,100].includes(e.keyCode)) return this.submit();
          // esc
          if(27 == e.keyCode ) return this.cancel();
          this.$refs.croper.focus();
          switch (e.keyCode) {
            case 99:
            case 187:   // +
              this.zoom*= 1.05;
            break;
            case 101:
            case 189:   // -
              this.zoom*= 0.95;
            break;
            case 38:    // up
              this.offsetY--;
            break;
            case 40:    // down
              this.offsetY++;
            break;
            case 39:    // right
              this.offsetX++;
            break;
            case 37:    // left
              this.offsetX--;
            break;
          }
        }
      },
      onpaste (e){
        let data = getClipboard(e);
        if( data ) this.source = data;
      },
      onChoose (){
        this.$refs.file.click();
      },
      // 选择图片
      change (e){
        let file = e.target.files[0];
        if( !/image\/\w+/.test(file.type) ) {
          alert("请选择图像类型的文件");
          return false;
        }
        if( window.FileReader ) {
          let self = this;
          let fr = new FileReader();
          fr.readAsDataURL(file);
          fr.onloadend = function(e){
            self.reset();
            self.source = e.target.result;
          };
        }
      },
      reset (){
        this.zoom = 1;
        this.rotate = 0;        // 旋转
        this.offsetX = 0;        // X偏移
        this.offsetY = 0;        // Y偏移
      },
      drawEditor (){

        let self  = this;
        let editor= self.$refs.editor;
        let croper= self.$refs.croper;
        if( !editor || !croper) return;
        // 获取画布的真实尺寸（像素）
        let width = parseInt( editor.clientWidth );
        let height= parseInt( editor.clientHeight);

        // 图片缩放比率
        let radio = self.rotate / 90 % 2 == 0
              ? Math.min( 1, width/image.width, height/image.height )
              : Math.min( 1, height/image.width, width/image.height )
              ;

        let newWidth  = image.width * radio * self.zoom;
        let newHeight = image.height* radio * self.zoom;
        // 画布中图片的起始位置
        let x = (width - newWidth) / 2 ;
        let y = (height- newHeight)/ 2 ;
        // 中心点
        let cx= width/2 + self.offsetX;
        let cy= height/2+ self.offsetY;

        croper.width   = width;
        croper.height  = height;
        croper.ctx = croper.getContext("2d");

        editor.width   = width;
        editor.height  = height;
        editor.ctx = editor.getContext("2d");

        editor.ctx.save();
        editor.ctx.fillStyle = '#ffffff';
        editor.ctx.clearRect(0, 0, width, height); //清空内容
        editor.ctx.fillRect(0, 0, width, height);
        editor.ctx.translate( cx, cy );
        editor.ctx.rotate( self.rotate * Math.PI / 180 );
        editor.ctx.scale( self.zoom, self.zoom );

        editor.ctx.drawImage(
          image,
          0,
          0,
          image.width,
          image.height,
          - newWidth / 2,
          - newHeight / 2,
          newWidth ,
          newHeight
        );
        editor.ctx.rotate( -self.rotate * Math.PI / 180 );
        editor.ctx.translate( -cx, -cy );
        editor.ctx.restore();

        // 取景框
        let vw = parseInt(self.size.width);
        let vh = parseInt(self.size.height);
        self.finder = {
          x: (width - vw) / 2,
          y: (height- vh) / 2,
          w: vw,
          h: vh,
        };
        // 遮罩层
        croper.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        croper.ctx.fillRect(0, 0, width, (height-vh)/2);
        croper.ctx.fillRect(0, (height+vh)/2, width, (height-vh)/2);
        croper.ctx.fillRect(0, (height-vh)/2, (width-vw)/2, vh);
        croper.ctx.fillRect((width+vw)/2, (height-vh)/2, (width-vw)/2, vh);
      },
      dragEvent (){

        let self = this;
        let croper = self.$refs.croper;
        let active = false;
        let moving = false;
        let startX = 0;
        let startY = 0;
        let distX  = 0;
        let distY  = 0;
        let oldX   = 0;
        let oldY   = 0;

        if(!croper) return;
        croper.addEventListener(evStart, function(e){
          // e.stopPropagation();
          // e.preventDefault();
          if( active || moving) return;
          active = true;;
          startX = isTouchDevice ? e.touches[0].pageX : e.pageX;
          startY = isTouchDevice ? e.touches[0].pageY : e.pageY;
          oldX = self.offsetX;
          oldY = self.offsetY;
        },false);
        croper.addEventListener(evMove, function(e) {
          e.stopPropagation();
          e.preventDefault();
          if( moving || !active ) return;
          distX = (isTouchDevice ? e.touches[0].pageX : e.pageX) - startX;
          distY = (isTouchDevice ? e.touches[0].pageY : e.pageY) - startY;
          self.offsetX = oldX + distX;
          self.offsetY = oldY + distY;
        },false);
        croper.addEventListener(evEnd, function(e){
          moving = false;
          active = false;
        },false);
      },
      // 颜色拾取
      // colorPicker (e){
      //     let canvas = this.$refs.size;
      //     if( !canvas.context ) return;
      //     let rect = canvas.getBoundingClientRect();
      //     let x = e.clientX - rect.left;
      //     let y = e.clientY - rect.top;
      //     let rgba = canvas.context.getImageData(x, y, 1, 1).data;
      //     this.drawViewer( 'rgba('+ rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] + ')' );
      // },
      // 平移
      // move (v){
      //     switch (v) {
      //         case 'left':
      //             this.offsetX -= 10;
      //         break;
      //         case 'right':
      //             this.offsetX += 10;
      //         break;
      //         case 'up':
      //             this.offsetY -= 10;
      //         break;
      //         case 'down':
      //             this.offsetY += 10;
      //         break;
      //     }
      // },
      // 放大缩小
      zoomInOut (v){
        this.zoom *= (v == 'in' ? 1.25 : 0.8);
      },
      // 旋转
      turn (v){
        this.rotate += v * 90;
      },
      getCrossOrign (url){
        this.source = `${this.fetchurl}?imgurl=${url}?tt=${Date.now()}`;
      },
      cancel (){
        this.state = false;
      },
      // 提交保存
      submit: async function(){
        let self = this;
        if( !self.value ){
          self.$refs.select.focus();
          return self.selectTips = true;
        }

        let editor = self.$refs.editor.getContext("2d");
        let tmp = document.createElement('canvas');

        tmp.width = self.finder.w;
        tmp.height = self.finder.h;
        tmp.ctx = tmp.getContext("2d");
        tmp.ctx.clearRect(0, 0, tmp.width, tmp.height);
        tmp.ctx.putImageData(editor.getImageData(self.finder.x, self.finder.y, self.finder.w, self.finder.h), 0, 0)

        let canvasData = tmp.ctx.canvas.toDataURL('image/jpeg');
        let data = {
          value: self.value,
          image: canvasData,
          sizeinfo: JSON.stringify(self.size),
        };

        tmp = null;
        self.state = 'loading';
        if(typeof self.onSubmit === 'function'){
          try{
            await self.onSubmit(data);
          } catch (e) {
            DEBUG && console.log(e);
          }
        }
        self.state = false;
      },
    }
  }
</script>
