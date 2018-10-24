<style lang="sass">
  @import "~fancy_style"
  .fancy-loading
    display: flex
    flex-flow: column nowrap
    min-height: $row-height
    > em
      flex: 1
      background: url(images/spinner.svg?fill=#{$colorTheme}) no-repeat center center
      background-size: auto 100%
      animation: fancy-loading 1s infinite steps(8)
      @keyframes fancy-loading
        0%
          transform: rotate(0deg)
        100%
          transform: rotate(359deg)
    > div
      padding-top: $space
      text-align: center
</style>

<template lang="pug">
  .fancy-loading
    em
    div(v-if="cfg.content" v-html="cfg.content")
</template>

<script>
const Options = {
  content: '',
}
export default {
  props: ['cfg'],
  created() {
    Object.keys(Options).forEach(i => this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, Options[i]))
  },
}
</script>
