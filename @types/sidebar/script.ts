import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

export interface ISideBar {
  data: any
  active?: string
  onSlide?: (v: boolean) => void
  callback?: (state?: boolean, data?: any) => any
}

const options: ISideBar = {
  data: null,
  active: '',
}

@Component
export default class App extends Vue {
  @Prop() private cfg: ISideBar

  private state: boolean = false
  private folded: any = {}

  protected created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })

    const storage: any = this.cfg.callback() || {}
    this.state = storage.state || false
    this.folded = storage.folded || {}

    this.onCfgDataChanged(this.cfg.data)
  }

  @Watch('state')
  protected onStateChanged(val: boolean, oldVal: boolean) {
    this.cfg.onSlide(val)
  }

  @Watch('cfg.data')
  protected onCfgDataChanged(val: object) {
    for (const i of Object.keys(val)) {
      this.$set(this.folded, i, this.folded[i] || false)
    }
  }

  protected onSetState(): void {
    this.state = !this.state
    this.cfg.callback(this.state, this.folded)
  }

  protected onSetFold(name: string) {
    this.folded[name] = !this.folded[name]
    this.cfg.callback(this.state, this.folded)
  }
}
