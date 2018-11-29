import { Component, Prop, Vue } from 'vue-property-decorator'

export interface INotice {
  message?: string
  duration?: string
  delay?: string
  onComplete?: () => void
}

const options: INotice = {
  message: '',
  duration: '3s',
  delay: '0s',
}

@Component
export default class App extends Vue {
  @Prop() private cfg: INotice

  protected mounted() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
    if (this.cfg.message && this.cfg.onComplete) {
      const t = parseInt(this.cfg.duration, 10) * 1000
      setTimeout(() => this.cfg.onComplete(), t)
    }
  }
}
