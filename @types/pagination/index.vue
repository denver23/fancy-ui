<template lang="pug">
  .fancy-pagination(v-if="cfg.total > 0")
    ul
      li(
        v-for="(v,index) in forData"
        v-bind:class="{'active': cfg.page == v.num, 'disabled': (index == 0 && v.num <=0 ) || ( index == forData.length - 1 && v.num > maxPage )}"
      )
        a(@click.prevent="onClick(v.num)" href="#" target="_self")
          span(v-text="v.text")
</template>

<script src="./script.ts"></script>

<style lang="sass">
  @import "~fancy_style"

  .fancy-pagination
    padding: $space
    ul
      text-align: center
      display: flex
      align-items: center
      justify-content: center
    li
      > a
        position: relative
        display: block
        height: $row-height
        width: $row-height
        color: #337ab7
        background-color: #fff
        text-decoration: none
        border: 1px solid $borderColor
        border-left: none
        box-sizing: border-box
        span
          position: absolute
          top: 50%
          left: 50%
          transform: translate3d(-50%, -50%, 0)
        &:hover
          color: #23527c
          background-color: #eee
          border-color: #ddd

      &:first-child,
      &:last-child
        > a
          width: auto
          padding: 0 $space * 2
      &:first-child
        > a
          border-left: 1px solid $borderColor
      &.active
        > a
          &,
          &:hover,
          &:focus
            color: #fff
            background-color: #337ab7
            border-color: #337ab7
            cursor: default
      &.disabled
        > a
          &,
          &:hover,
          &:focus
            color: #777
            background-color: #fff
            border-color: #ddd
            cursor: not-allowed

</style>
