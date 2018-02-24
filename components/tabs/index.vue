<style lang="sass">
  @import "~fancy_style"

  .fancy-tabs
    height: $row-height
    ul
      display: flex
      > li
        display: inline-block
        height: $row-height
        line-height: $row-height
        box-sizing: border-box
        background: #fbfaf8
        border: 1px solid $borderColor
        border-left: none
        &:hover
          opacity: 0.8
        &:first-child
          border-left: 1px solid $borderColor
        &:last-child
          border-top: none
          border-right: none
          background: none
          flex: 1
          &:hover
            opacity: 1

        &.fc-active
          border-top: 2px solid $colorTheme
          border-bottom: none
          background: #fff
          a
            color: $colorFont
        a
          padding: 0 $space * 4
          display: block
          outline: none
          text-align: center
          &:hover
            color: $colorFont

    @media #{$device-phone}
      ul
        > li
          flex: 1
          &:last-child
            display: none
</style>

<template lang="pug">
  .fancy-tabs(v-if="cfg.data")
    ul
      li(:class="{'fc-active': cfg.active === k}" v-for="(v, k) in cfg.data")
        a(:href="v.url" v-html="v.title")
      li
</template>

<script>
  export default {
    props: ['cfg'],
  }
</script>
