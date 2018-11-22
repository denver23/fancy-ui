import { Component, Vue } from 'vue-property-decorator'

export interface IConfirm {
  message?: string
  confirm?: string
  cancel?: string
  onConfirm?: () => void
  onCancel?: () => void
}

const options: IConfirm = {
  message: '',
  confirm: 'confirm',
  cancel: 'cancel',
}

@Component({
  props: ['cfg'],
})
export default class App extends Vue {
  private cfg: IConfirm
  private sending: boolean = false

  protected created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
    document.addEventListener('keydown', this.onKeyDown, false)
  }

  protected mounted() {
    this.$el.focus()
  }

  protected destroyed() {
    document.removeEventListener('keydown', this.onKeyDown, false)
  }

  protected onKeyDown(e: KeyboardEvent) {
    // enter space center esc
    if ([13, 32, 100, 27].includes(e.keyCode)) {
      e.preventDefault()
      e.stopPropagation()

      // esc
      if (e.keyCode === 27 || !this.cfg.confirm) {
        return this.onClick(0)
      }
      return this.onClick(1)
    }
  }
  protected async onClick(type?: number) {
    if (this.sending) {
      return
    }
    this.sending = !!type
    try {
      type ? await this.cfg.onConfirm() : await this.cfg.onCancel()
    } catch (e) {
      console.log(e)
    }
    this.sending = false
  }
}
