
<template lang="pug">
  .fancy-confirm(tabindex="1")
    div
      .fc-msg(v-html="cfg.message")
      .fc-btns
        span(:class="{'fc-sending': sending}" v-if="cfg.confirm" @click="onClick(1)") {{cfg.confirm}}
        span(v-if="cfg.cancel" @click="onClick(0)") {{cfg.cancel}}
</template>

<script src="./script.ts"></script>

<style lang="sass">
  @import "~fancy_style"
  @import "~fancy_mixins"

  .fancy-confirm
    @include mixin-mask()
    &:focus
      outline: 0
    > div
      position: absolute
      top: 50%
      left: 50%
      max-width: 90%
      max-height: 90%
      min-width: 18rem
      display: flex
      flex-direction: column
      border-radius: $borderRadius
      background-color: #fff
      transform: translate3d( -50%, -50%, 0)

      .fc-msg
        text-align: center
        padding: $space * 4 0
      .fc-btns
        display: flex
        span
          display: block
          flex: 1
          cursor: pointer
          text-align: center
          line-height: $form-height
          margin: 0 $space $space
          border-radius: $borderRadius
          background: $colorTheme
          color: #fff
          &:hover
            opacity: 0.8
          &:nth-child(2)
            margin-left: 0
            background: $colorDisable
          &:first-child:last-child
            margin: 0
          &.fc-sending
            position: relative
            &::after
              content: ""
              position: absolute
              top: 0
              right: 0
              height: $form-height
              width: $form-height / 3 * 2
              mask: url(images/spinner.svg) no-repeat center center
              mask-size: auto 50%
              background-color: #fff
              animation: fancy-confirm-sending 1s infinite steps(8)
              @keyframes fancy-confirm-sending
                0%
                  transform: rotate(0)
                100%
                  transform: rotate(359deg)

    @media #{$device-phone}
      > div
        min-width: 70%
    @media #{$device-pad}
      > div
        min-width: 40%

</style>
