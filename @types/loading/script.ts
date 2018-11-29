import { Component, Prop, Vue } from 'vue-property-decorator'

export interface ILoading {
  content: string
}

const options: ILoading = {
  content: '',
}

@Component
export default class App extends Vue {
  @Prop() private cfg: ILoading

  protected created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
  }
}
