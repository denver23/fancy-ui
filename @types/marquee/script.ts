import { Component, Prop, Vue } from 'vue-property-decorator'

export interface IMarquee {
  data?: any[]
  speed?: string
  delay?: string
  dataFormat?: (v: any) => string
  onComplete?: () => void
}

const options: IMarquee = {
  speed: '0s',
  delay: '2s',
  data: null,
  dataFormat: (val: any) => `<a href="${val.url}">${val.name}</a>`,
}

@Component
export default class App extends Vue {
  @Prop() private cfg: IMarquee

  protected mounted() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
    const self = this
    function anim() {
      setTimeout(anim, parseInt(self.cfg.delay, 10) * 1000)
    }
    anim()
  }
}
