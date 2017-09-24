<style lang="sass">
  @import "~fancy_style"

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

<template lang="jade">
  .fancy-alert(tabindex="1",:class="{'fc-mask':cfg.ismask}")
    div
      .fc-msg(v-html="cfg.message")
      .fc-btn(v-if="cfg.confirm" @click="_done()") {{cfg.confirm}}
</template>

<script>
  const Options = {
    message: '',
    confirm: 'ok',
    ismask: true,
    onConfirm() {},
    __name: 'alert',
  }
  export default {
    props: ['cfg'],
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
          return this._done()
        }
      },
      _done: async function() {
        try{
          this.cfg.onConfirm && await this.cfg.onConfirm()
          this.cfg.__name && (this.$parent[this.cfg.__name] = false)
        } catch(e) {}
      },
    },
  }
</script>

