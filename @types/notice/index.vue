<template lang="pug">
  .fancy-notice(
    :style="{'animation-duration': cfg.duration,'animation-delay': cfg.delay}"
    v-if="cfg.message"
    v-html="cfg.message"
  )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

export interface IFancyNotice {
  message?: string
  duration?: string
  delay?: string
  onComplete?: () => void
}

const options: IFancyNotice = {
  message: '',
  duration: '3s',
  delay: '0s',
  onComplete() {console.log('onComlete')},
}

@Component({
  props: ['cfg'],
})
export default class App extends Vue {
  private cfg: any

  private mounted() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
    this.cfg.message &&
      this.cfg.onComplete &&
      setTimeout(() => {
        this.cfg.onComplete()
      }, Math.trunc(this.cfg.duration) * 1000)
  }
}
</script>
<style lang="sass">
  @import "~fancy_style"

  .fancy-notice
    position: fixed
    top: 50%
    left: 50%
    width: 20rem
    border-radius: $borderRadius
    overflow: hidden
    z-index: $zIndex + 100
    padding: $space * 4 0
    text-align: center
    color: #fff
    background: rgba($colorTheme, 0.7)
    transform: translate3d(-50%, -100%, 0)
    animation: anim-notice 3s 1 ease-in-out alternate
    opacity: 0
    @keyframes anim-notice
      0%,100%
        opacity: 0
        transform: translate3d(-50%, -100%, 0)
      25%,50%,75%
        opacity: 1
        transform: translate3d(-50%, -50%, 0)
    @keyframes anim-notice-mobile
      0%,100%
        opacity: 0.5
        transform: translate3d(0, -100%, 0)
      25%,50%,75%
        opacity: 1
        transform: translate3d(0, 0, 0)

    @media #{$device-mobile}
      top: 0
      left: 0
      right: 0
      width: 100%
      border-radius: 0
      background: rgba(#000, 0.7)
      transform: translate3d(0, -100%, 0)
      animation-name: anim-notice-mobile

</style>
