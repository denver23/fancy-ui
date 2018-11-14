<template lang="pug">
  .fancy-alert(tabindex="1",:class="{'fc-mask':cfg.ismask}")
    div
      .fc-msg(v-html="cfg.message")
      .fc-btn(v-if="cfg.confirm" @click="onClick()") {{cfg.confirm}}
</template>

<script src="./script.ts"></script>

<style lang="sass">
  @import "~fancy_style"
  @import "~fancy_mixins"
  .fancy-alert
    &.fc-mask
      @include mixin-mask()
    &:focus
      outline: 0
    > div
      position: absolute
      top: 50%
      left: 50%
      max-width: 90%
      max-height: 90%
      min-width: 16rem
      display: flex
      flex-direction: column
      border-radius: $borderRadius
      overflow: hidden
      background-color: #fff
      transform: translate3d( -50%, -50%, 0)
      .fc-msg
        text-align: center
        padding: $space * 4 0
      .fc-btn
        cursor: pointer
        text-align: center
        margin: 0
        line-height: $form-height
        background: $colorTheme
        color: #fff
        &:hover
          opacity: 0.8

    @media #{$device-phone}
      > div
        min-width: 60%
    @media #{$device-pad}
      > div
        min-width: 40%
</style>
