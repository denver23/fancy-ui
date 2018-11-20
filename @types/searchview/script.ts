import { Component, Watch, Vue } from 'vue-property-decorator'

export interface ISearchView {
  attr?: any
  data?: any[]
  value?: any
  empty?: string
  onChange?: () => void
  onChoose?: (item?: any) => void
}

const options: ISearchView = {
  attr: {},
  data: [],
  value: '',
  empty: '',
  onChoose: (item: any) => console.log(item),
}

@Component({
  props: ['cfg'],
  filters: {
    highlight(str: string, val: string) {
      return val ? str.replace(new RegExp(val, 'ig'), `<em>${val}</em>`) : str
    },
  },
})
export default class App extends Vue {
  private cfg: ISearchView
  private show: boolean = false
  private selectIndex: number = 0

  protected created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
  }

  @Watch('show')
  private onShowChanged(val: boolean) {
    if (val && this.cfg.value && this.cfg.data) {
      const index = this.cfg.data.findIndex(v => v.name === this.cfg.value)
      const list: any = this.$refs.list
      index >= 0 && requestAnimationFrame(() => list.children[index].scrollIntoView(false))
    }
  }

  protected onFocus(e: any) {
    e.preventDefault()
    this.show = true
  }
  protected onBlur() {
    setTimeout(() => (this.show = false), 200)
  }

  protected onKeyDown(e: KeyboardEvent) {
    if ([13, 38, 40].includes(e.keyCode)) {
      e.preventDefault()
      e.stopPropagation()
    }
    // enter
    if (e.keyCode === 13) {
      return this.onChoose()
    }
  }
  protected onKeyUp(e: KeyboardEvent) {
    if ([13, 38, 40].includes(e.keyCode)) {
      e.preventDefault()
      e.stopPropagation()
    }
    // enter
    if (e.keyCode === 13) {
      return
    }
    // up down key
    if (e.keyCode === 38 || e.keyCode === 40) {
      const len = this.cfg.data.length
      if (len === 0) {
        return
      }
      this.selectIndex += e.keyCode === 40 ? 1 : -1
      if (this.selectIndex < 0) {
        this.selectIndex = len - 1
      } else if (this.selectIndex >= len) {
        this.selectIndex = 0
      }

      const list: any = this.$refs.list
      list.children[this.selectIndex].scrollIntoView(false)
      return
    }
    this.cfg.onChange.call(this, this.cfg.value)
  }

  protected onChoose(val?: any) {
    if (this.selectIndex < 0) {
      return
    }
    const item = val || this.cfg.data[this.selectIndex]
    this.cfg.onChoose(item)
    this.show = false
  }
}