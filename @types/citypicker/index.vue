<template lang="pug">
  .fancy-citypicker(@click="onClose" v-show="cfg.visible")
    div(@click.stop="")
      h4
        em.fc-back(v-if="level" @click="onBack()")
        em.fc-delete(v-else @click="onClear()")
        span {{title}}
        em(@click="onClose")
      ul(ref="picker")
        li(
          v-for="(v,k) of children"
          v-bind:class="{'fc-chked': current.id == v.id, 'fc-active': index == k }"
          v-text="v.name"
          @click="onChoose(k, v)"
        )
</template>

<script src="./script.ts"></script>

<style lang="sass">
  @import "~fancy_style"
  @import "~fancy_mixins"

  .fancy-citypicker
    @include mixin-mask()
    padding: $space * 4 0
    > div
      height: 100%
      margin: 0 auto
      max-width: 30rem
      display: flex
      flex-direction: column
      background: #fff
    h4
      margin: 0
      height: $row-height
      border-bottom: 2px solid $colorTheme
      display: flex
      align-items: center
      span
        flex: 1
        display: block
        color: $colorTheme
        text-align: center
      em
        cursor: pointer
        display: block
        width: $row-height
        height: $row-height
        mask: url(images/android-close.svg) no-repeat center
        mask-size: 70% auto
        background-color: $colorTheme
        &:hover
          opacity: 0.5
        &.fc-delete
          mask-image: url(images/ios-trash-outline.svg)
          background-color: $borderColor
        &.fc-back
          mask-image: url(images/android-arrow-back.svg)
    ul
      flex: 1
      overflow-y: auto
      overflow-x: hidden
      li
        position: relative
        padding: 0 1rem 0 2rem
        line-height: $row-height
        border-bottom: 1px solid $borderColor
        cursor: pointer
        &.fc-active
          background: #eee
        &:hover
          background: #f8f8f8
        &::before,&::after
          content: ""
          position: absolute
          left: 1rem
          top: 50%
          width: 1rem
          height: 1rem
          border: 1px solid $colorTheme
          border-radius: 100%
          box-sizing: border-box
          transform: translate3d(-50%, -50%, 0)
        &.fc-chked::after
          width: 0.6rem
          height: 0.6rem
          background: $colorTheme

    @media #{$device-phone}
      > div
        max-width: 90%
    @media #{$device-pad}
      > div
        max-width: 60%

</style>
