<style lang="sass">
  @import "~fancy_style"

  .fancy-upload
    $size: 6rem
    &.fc-right
      position: fixed
      z-index: $zIndex - 1
      top: 0
      bottom: 0
      right: 0
      overflow-y: auto
      overflow-x: hidden

      padding: $space
      width: $size + $space * 2
      box-sizing: border-box
      opacity: 0.4
      background: #fff
      border-left: 1px solid $borderColor
      &:hover
        opacity: 1
    canvas
      visibility: hidden
    ul,
    li
      padding: 0
      margin: 0
      list-style: none
    li
      position: relative
      display: inline-block
      margin: $space / 2
      width: $size
      height: $size
      overflow: hidden
      border: 1px solid rgba($borderColor, 0.8)
      border-radius: $borderRadius
      cursor: pointer
      box-sizing: border-box
      &:hover
        border-color: $colorTheme
      &:not(:last-child)
        &::after
          content: attr(index)
          position: absolute
          top: 0
          right: 0
          width: 1.6em
          height: 1.6em
          border-radius: 100%
          background: rgba(#000, 0.5)
          color: #fff
          display: flex
          justify-content: center
          align-items: center
      // add button
      &:last-child
        background: #fff
        input
          display: block
          position: absolute
          opacity: 0
          top: 0
          left: 0
          bottom: 0
          right: 0
          z-index: 10
          cursor: pointer
          min-width: auto
          height: auto
          margin: 0
          padding: 0
        &:hover
          &::before,
          &::after
            border-color: $colorTheme
        &::before,
        &::after
          content: ""
          position: absolute
          top: 50%
          left: 50%
          opacity: 0.5
        &::before
          width: 40%
          border-top: 3px solid $borderColor
          transform: translate3d(-50%,-1px,0)
        &::after
          height: 40%
          border-left: 3px solid $borderColor
          transform: translate3d(-1px,-50%,0)
      > div
        height: $size
        img
          position: absolute
          width: 100%
          top: 50%
          transform: translate3d(0, -50%, 0)

        .fc-progress
          position: absolute
          top: 50%
          left: 0
          right: 0
          margin: 0 $space
          transform: translate3d(0, -40%, 0)
          text-align: center
          &::before
            content: ""
            position: absolute
            left: 0
            right: 0
            z-index: -1
            background: #fff
            height: $space
            border-radius: $space
          &::after
            content: attr(data)
            color: #fff
          .fc-bar
            height: $space
            background: red
            border-radius: $space
            margin-bottom: $space / 2

    @media #{$device-mobile}
      li:last-child
        input
          position: absolute
          top: 0
          left: 0
          bottom: 0
          right: 0
          height: auto

</style>

<template lang="jade">
  .fancy-upload(:class="'fc-'+ cfg.dock" v-show="cfg.data.length || cfg.button")
    ul(ref="workbench")
      li(:class="'fc-'+ v.type" v-for="(v,key) in cfg.data" v-bind:index="key + 1")
        div(@click="_choose(v)")
          img(:src="v.src || v.url" v-if="v.src || v.url")
          .fc-progress(v-if="v.progress && v.progress < 100" v-bind:data="v.progress + '%'")
            .fc-bar

        canvas(:style="cfg.size" v-if="v.base64")
        //- .fc-2
        //-     //- label.fa.fa-rotate-left(@click="turn($index,1)")
        //-     //- label.fa.fa-rotate-right(@click="turn($index,2)")
        //-     cite.fa.fa-close(@click="del($index)")
      li(v-show="cfg.button")
        input(ref="file" type="file" @change="_change" multiple="multiple")
</template>

<script>
  const isData  = str => /^data:image.*base64,/.test(str);
  const isImage = str => /^(data:)?image\/(jpe?g|gif|png)/.test(str);
  const isBlob  = str => /^blob:/.test(str);

  // data: [
  //     {
  //         url: 'http://pic.sc8.com/pic/1610/190354024805.jpg',
  //     },
  //     {
  //         url: 'http://pic.sc8.com/pic/1610/190354024805.jpg'
  //     },
  // ],

  const Options = {
    data: [],
    dock: 'none', // on the right and fixed
    button: false,
    field: 'file', // form name
    param: {}, // post param
    size: {
      maxWidth: '1080px',
      maxHeight: '',
    },
    trigger: false,
    onClick: item => console.log(item),
    onPostComplete: (res, item) => {},
  };

  export default {
    props: ['cfg'],
    created() {
      this.dataTimer = null;
      Object.keys(Options).forEach(i => {
        (i in this.cfg) || this.$set(this.cfg, i, Options[i]);
      });
    },
    watch: {
      'cfg.data' (val) {
        if (!val.length) return;
        let self = this;
        clearTimeout(self.dataTimer);
        self.dataTimer = setTimeout(() => {
          let i = 0;
          for (let item of val) {
            if (!item.drawing && (isData(item.base64) || isBlob(item.base64))) self._drawImage(i, item);
            i++;
          }
        }, 200);
      },
      'cfg.trigger' (val) {
        val && this.$refs.file.click();
        this.cfg.trigger = false;
      },
    },
    methods: {
      // del(index) {
      //   this.cfg.data.splice(index, 1);
      // },
      _choose(item) {
        this.cfg.onClick(item);
      },
      // http://my.oschina.net/u/1377774/blog/284703
      _change(e) {
        let files = e.target.files;
        let len = files.length;
        if (len == 0) return;
        if (window.FileReader) {
          for (let v of files) {
            if (isImage(v.type)) {
              let fr = new FileReader();
              fr.readAsDataURL(v);
              fr.onloadend = (e) => {
                this.cfg.data.push({
                  url: '',
                  src: '',
                  base64: e.target.result,
                  // size : v.size,
                });
              };
            }
          }
        }
      },
      _drawImage(index, item) {
        // let rotate = item.rotate || 0;
        this.$set(this.cfg.data[index], 'type', 'image');
        let image = new Image();
        let canvas = this.$refs.workbench.children[index].getElementsByTagName('canvas')[0];

        image.src = item.base64;
        image.onload = () => {
          item.drawing = true;
          // init
          // rotate / 90 % 2 == 0
          // ? [canvas.width, canvas.height] = [image.width, image.height]
          // : [canvas.width, canvas.height] = [image.height, image.width]
          // ;
          [canvas.width, canvas.height] = [image.width, image.height];
          // size
          let width = parseInt(canvas.clientWidth);
          let height = parseInt(canvas.clientHeight);
          let radio = Math.min(1, width / canvas.width, height / canvas.height);

          width = canvas.width * radio;
          height = canvas.height * radio;
          // 画布最终大小
          canvas.width = width;
          canvas.height = height;
          // center point
          let cx = width / 2;
          let cy = height / 2;
          // 图像剪切大小
          let nWidth, nHeight;
          // rotate / 90 % 2 == 0
          // ? [nWidth,nHeight] = [width,height]
          // : [nWidth,nHeight] = [height,width]
          // ;
          [nWidth, nHeight] = [width, height];

          canvas.context = canvas.getContext("2d");
          canvas.context.save();
          canvas.context.clearRect(0, 0, width, height); //清空内容
          canvas.context.translate(cx, cy);
          // canvas.context.rotate( rotate * Math.PI / 180 );
          canvas.context.drawImage(
            image,
            0,
            0,
            image.width,
            image.height, -nWidth / 2, -nHeight / 2,
            nWidth,
            nHeight
          );
          // canvas.context.rotate( -rotate * Math.PI / 180 );
          canvas.context.translate(-cx, -cy);
          canvas.context.restore();

          item.src = canvas.context.canvas.toDataURL("image/jpeg");
          this.cfg.param && this.cfg.param.url && this._upload(index, item);
        }
      },
      _upload(index, item) {
        let self = this;
        let cfg = self.cfg;
        let fd = new FormData();
        let xhr = new XMLHttpRequest();

        this.$set(cfg.data[index], 'progress', 0);
        if (cfg.param) {
          for (let [key, val] of Object.entries(cfg.param)) {
            fd.append(key, val);
          }
        }
        fd.append(cfg.field || 'field', item.src);
        // loadstart：在接收到相应数据的第一个字节时触发。
        // progress：在接收相应期间持续不断触发。
        // error：在请求发生错误时触发。
        // abort：在因为调用abort()方法而终止链接时触发。
        // load：在接收到完整的相应数据时触发。
        // loadend：在通信完成或者触发error、abort或load事件后触发。
        //xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.upload.addEventListener("progress", _progress, false);
        xhr.addEventListener("load", _complete, false);
        xhr.addEventListener("error", _failed, false);
        xhr.open("POST", cfg.param.url);
        xhr.send(fd);

        function _progress(e) {
          if (e.lengthComputable) item.progress = Math.round(e.loaded * 100 / e.total);
        }
        function _complete(e) {
          try {
            let res = JSON.parse(e.target.responseText);
            item.url = cfg.onPostComplete(res, item) || res.data;
          } catch (e) {}
        }
        function _failed(e) {}
      },
      // http://www.zhangxinxu.com/wordpress/2011/02/html5-drag-drop-%E6%8B%96%E6%8B%BD%E4%B8%8E%E6%8B%96%E6%94%BE%E7%AE%80%E4%BB%8B/
      // drop (e){
      //     let files = e.dataTransfer.files;
      //     let len = files.length;
      //     for(let v of files){
      //     }
      // },
    }
  }
</script>
