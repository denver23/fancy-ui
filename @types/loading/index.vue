

<template lang="pug">
  .fancy-loading
    em
    div(v-if="cfg.content" v-html="cfg.content")
</template>

<script src="./script.ts"></script>

<style lang="sass">
  @import "~fancy_style"
  .fancy-loading
    display: flex
    flex-flow: column nowrap
    min-height: $row-height
    > em
      flex: 1
      background-color: $colorTheme
      mask: url(images/spinner.svg) no-repeat center center
      mask-size: auto 100%
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
