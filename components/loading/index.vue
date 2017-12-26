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
      animation: fancy-tables-loading 1s infinite steps(8)
      @keyframes fancy-tables-loading
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
    data() {
      return {
        error: false,
      }
    },
    created() {
      Object.keys(Options).forEach(i => {
        (i in this.cfg) || this.$set(this.cfg, i, Options[i])
      })
    },
  }
</script>
