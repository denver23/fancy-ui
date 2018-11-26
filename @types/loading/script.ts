import { Component, Vue } from 'vue-property-decorator'

export interface ILoading {
  content: string
}

const options: ILoading = {
  content: '',
}

@Component({
  props: ['cfg'],
})
export default class App extends Vue {
  private cfg: ILoading

  protected created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
  }
}
