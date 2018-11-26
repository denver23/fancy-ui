

<template lang="pug">
  .fancy-marquee(v-if="cfg.data.length")
    ul
      li(v-for="v of cfg.data" v-html="cfg.dataFormat(v)")
</template>

<script src="./script.ts"></script>
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
