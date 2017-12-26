<!--组件 工作台-->
<style lang="sass">
  @import "~fancy_style"


  .fancy-tools
    padding: 2rem 1rem
    > div
      border: 1px solid $borderColor
      padding: 1rem 0
      margin: 0 0 3rem
    legend
      border: none
      line-height: 2rem
      margin: -2rem 1rem 0
      background: #fff
      font-weight: bold
      width: auto
      padding: 0 1rem
      font-size: 1rem
      color: #f60
    li
      display: inline-block
      min-width: 8rem
      max-width: 50%
      overflow: hidden
      padding: 0 1rem
      line-height: 2rem
      height: 2rem
</style>

<template lang="pug">
  div(v-if="cfg" class="fancy-tools")
    div(v-for="value in cfg")
      legend {{value.legend}}
      ul
        li(v-for="v in value.links")
          a(:id="v.id" v-bind="v.attr") {{v.name}}
          span(v-html="v.others")
</template>

<script>
  export default {
    props: ['cfg']
  }
</script>

