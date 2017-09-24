<style lang="sass">
  @import "~fancy_style"

  .fancy-marquee
    height: $row-height
    overflow: hidden
    li
      line-height: $row-height
      @include ellipsis()
    @media #{$device-mobile}


</style>

<template lang="jade">
  .fancy-marquee(v-if="cfg.data.length")
    ul
      li(v-for="(v,k) of cfg.data" v-html="cfg.dataFormat(v)")
</template>

<script>
const Options = {
  speed: '0s',
  delay: '2s',
  data: '',
  dataFormat(val) {
    return `<a href="${val.url}">${val.name}</a>`
  },
  onComplete() { }
}
export default {
  props: ['cfg'],
  mounted() {
    Object.keys(Options).forEach(i => {
      (i in this.cfg) || this.$set(this.cfg, i, Options[i])
    })
    let anim
    (anim = () => {
      console.log(132)
      setTimeout(anim, parseInt(this.cfg.delay) * 1000)
    })()
  },
  methods: {

  }
}
</script>
