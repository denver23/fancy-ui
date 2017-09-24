<style lang="sass">
  @import "~fancy_style"

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
              background: url(images/spinner.svg?fill=#fff) no-repeat center center
              background-size: auto 50%
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

<template lang="jade">
  .fancy-confirm(tabindex="1")
    div
      .fc-msg(v-html="cfg.message")
      .fc-btns
        span(:class="{'fc-sending': sending}" v-if="cfg.confirm" @click="_done(1)") {{cfg.confirm}}
        span(v-if="cfg.cancel" @click="_done(0)") {{cfg.cancel}}
</template>

<script>
  const Options = {
    message: '',
    confirm: 'confirm',
    cancel: 'cancel',
    onConfirm() {},
    onCancel() {},
    __name: 'confirm',
    // onConfirm() {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => resolve(), 1000)
    //   })
    // },
  }
  export default {
    props: ['cfg'],
    data() {
      return {
        sending: false
      }
    },
    created() {
      Object.keys(Options).forEach(i => {
        (i in this.cfg) || this.$set(this.cfg, i, Options[i])
      })
      document.addEventListener('keydown', this._kdown, false)
    },
    mounted() {
      this.$el.focus()
    },
    destroyed() {
      document.removeEventListener('keydown', this._kdown, false)
    },
    methods: {
      _kdown(e) {
        // enter space center esc
        if ([13, 32, 100, 27].includes(e.keyCode)) {
          e.preventDefault()
          e.stopPropagation()
          // esc
          if (e.keyCode == 27 || !this.cfg.confirm) return this._done(0)
          return this._done(1)
        }
      },
      _done: async function(type) {
        if (this.sending) return
        this.sending = type
        try {
          type ? await this.cfg.onConfirm() : await this.cfg.onCancel()
        } catch (e) {}
        this.sending = false
        this.cfg.__name && (this.$parent[this.cfg.__name] = false)
      },
    },
  }
</script>

