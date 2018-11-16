import { Component, Watch, Vue } from 'vue-property-decorator'

export interface ICodeMessage {
  show?: boolean
  text?: string
  repeat?: string
  duration?: number
  history?: number
  auto?: boolean
  onSubmit?: () => {}
}

const options: ICodeMessage = {
  show: true,
  text: 'Send',
  repeat: 'Resend code',
  duration: 60,
  history: 0,
  auto: false,
}

@Component({
  props: ['cfg'],
})
/**
 * wegweg
 */
export default class App extends Vue {
  private cfg: ICodeMessage = null
  private downtime: number = 0
  private timer: any = null

  @Watch('cfg.show')
  protected onShowChanged(val: boolean) {
    val && this.cfg.auto && this.onClick()
  }

  protected get txt() {
    if (this.downtime <= 0) {
      return this.cfg.text
    }
    return this.cfg.repeat + `(${this.downtime})`
  }

  protected created() {
    Object.keys(options).forEach(i => this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i]))
    this.cfg.history > 0 && this.countdown()
    this.cfg.show && this.cfg.auto && this.onClick()
  }

  private async onClick(e?: MouseEvent | TouchEvent) {
    e && e.preventDefault()
    if (this.downtime > 0) {
      return
    }
    try {
      this.cfg.onSubmit && (await this.cfg.onSubmit.call(this))
      this.countdown()
    } catch (e) {
      console.log(e)
    }
  }

  private countdown() {
    this.downtime = Math.trunc(this.cfg.history || this.cfg.duration) + 1
    clearTimeout(this.timer)
    const run = () => {
      this.downtime--
      if (this.downtime < 0) {
        clearTimeout(this.timer)
        return
      }
      this.timer = setTimeout(run, 1000)
    }
    run()
  }
}
