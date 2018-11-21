import { Component, Watch, Vue } from 'vue-property-decorator'
import City from './city'

export interface ICityPicker {
  value?: string
  maxLevel?: number
  onSelect?: (cityid: string, cityname: string, path?: string[]) => any
}

const options: ICityPicker = {
  value: '',
  maxLevel: 2,
}

@Component({
  props: ['cfg'],
})
export default class App extends Vue {
  private cfg: ICityPicker
  private current: any = {}
  private level: number = 0
  private index: number = 0
  private breadcrumbs: any[] = []

  protected created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
    this.getdata(this.cfg.value)
    document.addEventListener('keydown', this.onKeyDown, false)
  }

  protected destroyed() {
    document.removeEventListener('keydown', this.onKeyDown, false)
  }

  protected get title() {
    return City.category[this.level]
  }

  protected get children() {
    let id = '0'
    const level = this.level
    function getChild(fid: string) {
      const arr = []
      if (!fid) {
        // 第一级,按顺序显示
        for (const n of City.province) {
          for (const v of City.data) {
            if (v.fid === '0' && v.name === n) {
              arr.push(v)
              break
            }
          }
        }
      } else {
        // 第n级
        for (const v of City.data) {
          if (v.fid === fid) {
            arr.push(v)
          }
        }
      }
      return arr
    }
    level && ({ id } = this.breadcrumbs[level - 1])
    // 直辖市 或 最后一级
    return City.zxs.indexOf(id) >= 0 || (level > 0 && level === this.cfg.maxLevel) ? [] : getChild(id)
  }

  protected getdata(val: string) {
    if (val) {
      const parents = City.getPath(val)
      if (parents) {
        this.breadcrumbs = parents
        this.level = parents.length - 1
        this.current = City.getByID(val) || ''

        const index = this.children.findIndex(value => value.id === this.current.id)
        this.index = index < 0 ? 0 : index
      }
    }
  }

  protected onScrollView() {
    const list = (this.$refs as any).picker.children
    if (this.index >= list.length) {
      this.index = 0
    }
    list[this.index].scrollIntoView(false)
  }
  protected onKeyDown(e: KeyboardEvent) {
    if ([8, 13, 27, 37, 38, 39, 40, 100].includes(e.keyCode)) {
      e.preventDefault()
      e.stopPropagation()
      // Esc
      if (27 === e.keyCode) {
        return this.onClose()
      }
      // enter
      if ([13, 100].includes(e.keyCode)) {
        return this.onChoose(this.index, this.children[this.index])
      }
      // let back
      if ([8, 37].includes(e.keyCode)) {
        return this.onBack()
      }

      const max = this.children.length || 1
      // up down
      if ([38, 40].includes(e.keyCode)) {
        this.index += e.keyCode === 40 ? 1 : -1
        if (this.index < 0) {
          this.index = max - 1
        } else if (this.index === max) {
          this.index = 0
        }
        this.onScrollView()
      }
    }
  }

  protected onChoose(index: number, item: any) {
    this.index = index
    this.current = item
    this.breadcrumbs = this.breadcrumbs.slice(0, this.level)
    this.breadcrumbs.push(item)
    this.level++
    if (!this.children.length) {
      this.cfg.onSelect && this.cfg.onSelect(item.id, item.name, this.breadcrumbs)
      this.level--
      this.onClose()
    }
  }

  protected onClear() {
    this.level = 0
    this.onClose()
    this.cfg.onSelect && this.cfg.onSelect('', '')
  }

  protected onBack() {
    if (this.level === 0) {
      return
    }
    this.level--
    this.current = this.breadcrumbs[this.level]
    const index = this.children.findIndex(value => value.id === this.current.id)
    this.index = Math.max(0, index)
    this.onScrollView()
  }

  protected onClose() {
    console.log('onClose')
  }
}
