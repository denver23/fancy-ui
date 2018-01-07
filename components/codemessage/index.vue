<style lang="sass">
  @import "~fancy_style"
  .fancy-codemessage
    button
      @include mixin-button()
      width: 100%
      padding: 0
      height: $form-height
      &:disabled
        background: $colorDisable
        color: $colorFont
</style>

<template lang="pug">
  .fancy-codemessage(v-if="cfg.show")
    button(
      v-bind="{disabled: downtime > 0}"
      v-text="_txt"
      @click="_click"
      type="button"
    )
</template>

<script>
const Options = {
  show: true,
  text: 'Send',
  repeat: 'Resend code',
  duration: 60, // second
  history: 0, // second
  auto: false,
  onSubmit() {},
}

export default {
  props: ['cfg'],
  data() {
    return {
      downtime: false,
    }
  },
  created() {
    this.timer = null
    Object.keys(Options).forEach(i => this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, Options[i]))
    this.cfg.history > 0 && this._countdown()
    this.cfg.show && this.cfg.auto && this._click()
  },
  watch: {
    'cfg.show'(v) {
      v && this.cfg.auto && this._click()
    },
  },
  computed: {
    _txt() {
      if (this.downtime === false) return this.cfg.text
      return this.cfg.repeat + (this.downtime > 0 ? `(${this.downtime})` : '')
    },
  },
  methods: {
    _click: async function(e) {
      e && e.preventDefault()
      if (this.downtime > 0) return
      try {
        this.cfg.onSubmit && (await this.cfg.onSubmit.call(this))
        this._countdown()
      } catch (e) {}
    },
    _countdown() {
      this.downtime = parseInt(this.cfg.history || this.cfg.duration) + 1
      clearTimeout(this.timer)
      let run = () => {
        this.downtime--
        this.timer = setTimeout(run, 1000)
        if (this.downtime < 0) {
          clearTimeout(this.timer)
        }
      }
      run()
    },
  },
}
</script>

