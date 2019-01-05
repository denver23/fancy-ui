import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

export interface IModalBox {
  title?: string
  content?: string | any
  confirm?: string
  cancel?: string
  component?: any // component组件
  tips?: string
  style?: object
  overlay?: boolean
  draggable?: boolean
  onComplete?: (el: Element) => void
  onConfirm?: (el: Element) => void
  onCancel?: () => void
}

const options: IModalBox = {
  title: '',
  content: '',
  confirm: 'confirm',
  cancel: 'cancel',
  component: '', // component组件
  tips: '',
  overlay: true,
  draggable: true,
}

@Component
export default class App extends Vue {
  @Prop() private cfg: IModalBox

  private sending: boolean = false

  @Watch('cfg.content')
  protected onContentChanged(val: string) {
    requestAnimationFrame(() => val !== 'loading' && this.cfg.onComplete && this.cfg.onComplete(this.$el))
  }

  protected created() {
    Object.keys(options).forEach(i => this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i]))
  }

  protected mounted() {
    this.cfg.content !== 'loading' && this.cfg.onComplete && this.cfg.onComplete(this.$el)
    document.addEventListener('keydown', this.onKdown, false)
  }

  protected destroyed() {
    document.removeEventListener('keydown', this.onKdown, false)
  }

  private onKdown(e: KeyboardEvent) {
    if (!this.cfg.content) {
      return
    }
    // enter space
    if (this.cfg.confirm && [13, 100, 32].includes(e.keyCode)) {
      e.preventDefault()
      e.stopPropagation()
      return this.onClick(1)
    }
    // esc
    if (e.keyCode === 27) {
      this.onClick(0)
    }
  }

  protected async onClick(type: number) {
    if (this.sending) {
      return
    }
    this.sending = !!type
    try {
      if (type) {
        await this.cfg.onConfirm(this.$el)
      } else {
        await this.cfg.onCancel()
        // this.cfg.__name && (this.$parent[this.cfg.__name] = false)
      }
    } catch (e) {
      console.log(e)
    }
    this.sending = false
  }
}
