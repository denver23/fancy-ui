import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

function isData(str: string): boolean {
  return /^data:image.*base64,/.test(str)
}
function isImage(str: string): boolean {
  return /^(data:)?image\/(jpe?g|gif|png)/.test(str)
}
function isBlob(str: string): boolean {
  return /^blob:/.test(str)
}

export enum EUploadDock {
  right = 'right',
  none = 'none',
}

interface IUploadItem {
  rid?: string
  url?: string
  src?: string
  type?: string
  base64?: string
  progress?: number
}

interface IUploadSize {
  maxWidth?: string
  maxHeight?: string
}

export interface IUpload {
  data?: IUploadItem[]
  dock?: EUploadDock
  button?: boolean
  field?: string
  param?: any
  size?: IUploadSize
  trigger: boolean
  onClick?: (item: any) => void
  onPostComplete?: (res: any, item: IUploadItem) => boolean
}

// let data = [
//   { url: 'http://pic.sc8.com/pic/1610/190354024805.jpg' },
//   { url: 'http://pic.sc8.com/pic/1610/190354024805.jpg' },
// ]

const options: IUpload = {
  data: [],
  dock: EUploadDock.none,
  button: false,
  field: 'file',
  param: {},
  size: {
    maxWidth: '1080px',
    maxHeight: '',
  },
  trigger: false,
}

@Component
export default class App extends Vue {
  @Prop() private cfg: IUpload
  private dataTimer: any = null

  protected created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
  }

  @Watch('cfg.data')
  protected onDataChanged(val: any[]) {
    if (!val.length) {
      return
    }
    clearTimeout(this.dataTimer)
    this.dataTimer = setTimeout(() => {
      let i = 0
      for (const item of val) {
        if (!item.drawing && (isData(item.base64) || isBlob(item.base64))) {
          this.drawImage(i, item)
        }
        i++
      }
    }, 200)
  }

  @Watch('cfg.trigger')
  protected onTriggerChanged(val: boolean) {
    val && (this.$refs as any).file.click()
    this.cfg.trigger = false
  }

  protected onChoose(item: any) {
    this.cfg.onClick(item)
  }
  // http://my.oschina.net/u/1377774/blog/284703
  protected onChange(e: any) {
    const files = e.target.files
    const len = files.length

    if (len === 0) {
      return
    }
    if ((window as any).FileReader) {
      for (const v of files) {
        if (isImage(v.type)) {
          const fr = new FileReader()
          fr.readAsDataURL(v)
          fr.onloadend = (ev: ProgressEvent) => {
            this.cfg.data.push({
              url: '',
              src: '',
              base64: (ev.target as any).result,
              // size : v.size,
            })
          }
        }
      }
    }
  }

  protected drawImage(index: number, item: any) {
    // let rotate = item.rotate || 0
    this.$set(this.cfg.data[index], 'type', 'image')
    const image = new Image()
    const canvas = (this.$refs as any).workbench.children[index].getElementsByTagName('canvas')[0]

    image.src = item.base64
    image.onload = () => {
      item.drawing = true
      // init
      // rotate / 90 % 2 == 0
      // ? [canvas.width, canvas.height] = [image.width, image.height]
      // : [canvas.width, canvas.height] = [image.height, image.width]
      //
      canvas.width = image.width
      canvas.height = image.height

      // size
      let width = parseInt(canvas.clientWidth, 10)
      let height = parseInt(canvas.clientHeight, 10)
      const radio = Math.min(1, width / canvas.width, height / canvas.height)

      width = canvas.width * radio
      height = canvas.height * radio
      // 画布最终大小
      canvas.width = width
      canvas.height = height
      // center point
      const cx = width / 2
      const cy = height / 2
      // 图像剪切大小
      const nWidth = width
      const nHeight = height
      // rotate / 90 % 2 == 0
      // ? [nWidth,nHeight] = [width,height]
      // : [nWidth,nHeight] = [height,width]
      //

      canvas.context = canvas.getContext('2d')
      canvas.context.save()
      canvas.context.clearRect(0, 0, width, height)
      canvas.context.translate(cx, cy)
      // canvas.context.rotate( rotate * Math.PI / 180 )
      canvas.context.drawImage(image, 0, 0, image.width, image.height, -nWidth / 2, -nHeight / 2, nWidth, nHeight)
      // canvas.context.rotate( -rotate * Math.PI / 180 )
      canvas.context.translate(-cx, -cy)
      canvas.context.restore()

      item.src = canvas.context.canvas.toDataURL('image/jpeg')
      this.cfg.param && this.cfg.param.url && this.upload(index, item)
    }
  }
  protected upload(index: number, item: any) {
    const cfg = this.cfg
    const fd = new FormData()
    const xhr = new XMLHttpRequest()

    this.$set(cfg.data[index], 'progress', 0)
    if (cfg.param) {
      for (const [key, val] of Object.entries(cfg.param)) {
        fd.append(key, val as string | Blob)
      }
    }
    fd.append(cfg.field || 'field', item.src)
    // loadstart：在接收到相应数据的第一个字节时触发。
    // progress：在接收相应期间持续不断触发。
    // error：在请求发生错误时触发。
    // abort：在因为调用abort()方法而终止链接时触发。
    // load：在接收到完整的相应数据时触发。
    // loadend：在通信完成或者触发error、abort或load事件后触发。
    // xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    xhr.upload.addEventListener('progress', _progress, false)
    xhr.addEventListener('load', _complete, false)
    xhr.addEventListener('error', _failed, false)
    xhr.open('POST', cfg.param.url)
    xhr.send(fd)

    function _progress(e: any) {
      if (e.lengthComputable) {
        item.progress = Math.round((e.loaded * 100) / e.total)
      }
    }
    function _complete(e: any) {
      try {
        const res = JSON.parse(e.target.responseText)
        item.url = cfg.onPostComplete(res, item) || res.data
      } catch (e) {
        console.log(e)
      }
    }
    function _failed(e: any) {
      console.log(e)
    }
  }
}
