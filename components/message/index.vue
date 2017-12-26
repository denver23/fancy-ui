<style lang="sass">
  @import "~fancy_style"

  .fancy-message
    padding: $space * 4
    .fc-status
      height: $space * 24
      background: url(images/checkmark-circled.svg?fill=#{$colorGreen}) no-repeat center center
      background-size: auto 100%
      &.fc-error
        background-image: url(images/close-circled.svg?fill=#{$colorRed})
      &.fc-question
        background-image: url(images/help-circled.svg?fill=#{$colorAlerm})
      &.fc-info,
      &.fc-alerm,
      &.fc-exclamation
        background-image: url(images/android-alert.svg?fill=#{$colorAlerm})

    .fc-content
      margin: $space * 2 auto
      text-align: center
      color: $colorGreen
      font-size: 2rem
      &.fc-error
        color: $colorRed
      &.fc-question
        color: $colorAlerm
      &.fc-info,
      &.fc-alerm,
      &.fc-exclamation
        color: $colorAlerm
</style>

<template lang="pug">
  .fancy-message(v-if="cfg.content && cfg.time != 0")
    .fc-status(:class="'fc-'+ cfg.status")
    .fc-content(:class="'fc-'+ cfg.status" v-html="cfg.content || cfg.status")
</template>

<script>

const Options = {
  status: 'success', // error | success | question | info | alert
  content: '',
  url: 'back',
  time: -1, // millisecond <0: no jump
}
export default {
  props: ['cfg'],
  created() {
    Object.keys(Options).forEach(i => {
      (i in this.cfg) || this.$set(this.cfg, i, Options[i])
    })
  },
  mounted() {
    this.jump(this.cfg.time, this.cfg.url)
  },
  methods: {
    jump(time, url) {
      time = parseInt(time)
      if (time >= 0 && url) {
        setTimeout(() => {
          if (typeof url === 'function') return url()
          if (url === 'back') return window.history.back()
          url === 'close' ? window.close() : (window.location = url)
        }, time)
      }
    }
  },
}
</script>
