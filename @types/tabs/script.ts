import { Component, Vue } from 'vue-property-decorator'

export interface ITabs {
  data: any[]
  active: number
}

const options: ITabs = {
  data: null,
  active: 0,
}

@Component({
  props: ['cfg'],
})
export default class App extends Vue {
  private cfg: ITabs

  protected created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
  }
}
