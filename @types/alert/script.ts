import { Component, Prop, Vue } from 'vue-property-decorator'

export interface IAlert {
  message?: string
  confirm?: string
  ismask?: boolean
  onConfirm?: () => void
}

const options: IAlert = {
  message: '',
  confirm: 'ok',
  ismask: true,
}

@Component
export default class App extends Vue {
  @Prop() private cfg: IAlert

  public created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
    document.addEventListener('keydown', this.onKdown, false)
  }

  public mounted() {
    (this.$el as any).focus()
  }

  public destroyed() {
    document.removeEventListener('keydown', this.onKdown, false)
  }

  private onKdown(e: KeyboardEvent) {
    // enter space center esc
    if ([13, 32, 100, 27].includes(e.keyCode)) {
      e.preventDefault()
      e.stopPropagation()
      return this.onClick()
    }
  }

  private async onClick() {
    try {
      this.cfg.onConfirm && (await this.cfg.onConfirm())
      // this.cfg.__name && (this.$parent[this.cfg.__name] = false)
    } catch (e) {
      console.log(e)
    }
  }
}
