
const Options = {
  content: '',
}
export default {
  props: ['cfg'],
  created() {
    Object.keys(Options).forEach(i => this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, Options[i]))
  },
}
