<style lang="sass">
  @import "~fancy_style"
  .fancy-tinymce
    textarea
      min-width: 10rem
      width: 10rem
    .mce-fullscreen
      z-index: $zIndex - 10
</style>

<template lang="pug">
  .fancy-tinymce
    textarea(:name="cfg.name" ref="textarea") {{cfg.value}}
</template>

<script>
// import tinymce from 'tinymce/tinymce'
// import 'tinymce/themes/modern/theme'
// import 'tinymce/plugins/paste'
// import 'tinymce/plugins/link'
// import 'tinymce/plugins/autolink'
// import 'tinymce/plugins/table'
// import 'tinymce/plugins/code'
// import 'tinymce/plugins/contextmenu'
// import 'tinymce/plugins/fullscreen'
// import 'tinymce/plugins/preview'

const Options = {
  name: 'content',
  value: '',
  btnImage: false,
  getContent() {},
  onPaste: str => str,
  onInsert: str => str,
  onReplaceImage(rid, url) {},
  fullscreenStateChanged(obj) {},
}
export default {
  props: ['cfg'],
  data() {
    return {}
  },
  created() {
    let cfg = this.cfg
    Object.keys(Options).forEach(i => cfg.hasOwnProperty(i) || this.$set(cfg, i, Options[i]))
  },
  mounted() {
    let self = this
    let toolbar = ['undo redo', 'styleselect', 'bold italic', 'alignleft aligncenter alignright alignjustify', 'link unlink table imageUpload imagePick', 'code fullscreen'].join(' | ')

    tinymce.init({
      // selector: 'textarea#'+ self.id,
      target: this.$refs.textarea,
      height: 600,
      plugins: ['autolink link table paste code fullscreen'],
      // force_p_newlines: true,
      toolbar,
      menubar: false,
      statusbar: false,
      language: 'zh_CN',
      content_style: `
        p,div {
          font-size: 14px
        }
        p {
          text-indent: 2em
        }
        p img {
          max-width: 90%;
          border: 1px solid #ddd;
          min-width: 100px;
          min-height: 100px;
          display: block;
          margin: 0 auto;
        }
        table.mce-item-table {
          width: 90%;
          border: 1px solid #ddd;
          margin: 0 auto;
          border-collapse: collapse
        }
        table.mce-item-table td {
          border: 1px solid #ddd
        }
        p.fancy-editor-image {
          text-align: center
        }
      `,
      add_form_submit_trigger: false,
      force_p_newlines: true,
      paste_data_images: true,
      // init_instance_callback: ed => {
      //     console.log(ed.id)
      // },
      code_dialog_width: '800',
      paste_postprocess(plugin, args) {
        if (self.cfg.onPaste) {
          args.node.innerHTML = self.cfg.onPaste(args.node.innerHTML)
        }
      },
      setup: ed => {
        ed.on('FullscreenStateChanged', e => this.cfg.fullscreenStateChanged(e))
        this.$set(this.cfg, 'getContent', () => ed.getContent())
        this.$set(this.cfg, 'onInsert', str => ed.insertContent(str))
        this.$set(this.cfg, 'onReplaceImage', (rid, url) => {
          if (rid && url) {
            let content = ed.getContent()
            if (new RegExp(`id="${rid}"`).test(content)) {
              let reg = new RegExp('<img(.*?)id="' + rid + '"(.*?)>')
              let str = content.replace(reg, img => img.replace(/src="(.*?)"/, v => `src="${url}"`))
              ed.setContent(str)
            }
          }
        })
        if (this.cfg.btnImage) {
          ed.addButton('imageUpload', {
            text: '',
            icon: 'image',
            onclick: this.cfg.btnImage,
          })
        }
        if (this.cfg.btnImagePick) {
          ed.addButton('imagePick', {
            text: 'pick',
            icon: '',
            onclick: () => this.cfg.btnImagePick(ed.getContent()),
          })
        }
        // let content = ed.getContent()
        // let html = (new DOMParser()).parseFromString(content,'text/html')
        // for( let v of html.getElementsByTagName('img')){
        //     let src = v.getAttribute('src')
        // }
      },
    })
  },
}
</script>
