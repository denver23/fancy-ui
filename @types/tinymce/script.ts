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
import { Component, Prop, Vue } from 'vue-property-decorator'
declare const tinymce: any
export interface ITinymce {
  name: string
  value: string
  btnImage: boolean
  btnImagePick?: (str: string) => string
  getContent?: () => string
  onPaste?: (str: string) => string
  onInsert?: (str: string) => string
  onReplaceImage?: (rid: string, url: string) => string
  fullscreenStateChanged?: (obj: any) => void
}

const options: ITinymce = {
  name: 'content',
  value: '',
  btnImage: false,
}

@Component
export default class App extends Vue {
  @Prop() private cfg: ITinymce

  protected created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
  }

  protected mounted() {
    const self = this
    const toolbar = [
      'undo redo',
      'styleselect',
      'bold italic',
      'alignleft aligncenter alignright alignjustify',
      'link unlink table imageUpload imagePick',
      'code fullscreen',
    ].join(' | ')

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
      paste_postprocess(plugin: any, args: any) {
        if (self.cfg.onPaste) {
          args.node.innerHTML = self.cfg.onPaste(args.node.innerHTML)
        }
      },
      setup: (ed: any) => {
        ed.on('FullscreenStateChanged', (e: any) => this.cfg.fullscreenStateChanged(e))
        this.$set(this.cfg, 'getContent', () => ed.getContent())
        this.$set(this.cfg, 'onInsert', (str: string) => ed.insertContent(str))
        this.$set(this.cfg, 'onReplaceImage', (rid: string, url: string) => {
          if (rid && url) {
            const content = ed.getContent()
            if (new RegExp(`id="${rid}"`).test(content)) {
              const reg = new RegExp('<img(.*?)id="' + rid + '"(.*?)>')
              const str = content.replace(reg, (img: string) => img.replace(/src="(.*?)"/, v => `src="${url}"`))
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
  }
}
