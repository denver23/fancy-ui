<template lang="pug">
  .fancy-alert(tabindex="1",:class="{'fc-mask':cfg.ismask}")
    div
      .fc-msg(v-html="cfg.message")
      .fc-btn(v-if="cfg.confirm" @click="onClick()") {{cfg.confirm}}
</template>

<script lang="ts">
declare var document: any
import { Component, Vue } from 'vue-property-decorator'

export interface IFancyAlert {
  message?: string
  confirm?: string
  ismask?: boolean
  onConfirm?: () => {}
}

const options: IFancyAlert = {
  message: '',
  confirm: 'ok',
  ismask: true,
}

@Component({
  props: ['cfg'],
})
export default class App extends Vue {
  private cfg: any
  public created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
    document.addEventListener('keydown', this.onKdown, false)
  }

  public mounted() {
    this.$el.focus()
  }

  public destroyed() {
    document.removeEventListener('keydown', this.onKdown, false)
  }

  private onKdown(e: any) {
    // enter space center esc
    if ([13, 32, 100, 27].includes(e.keyCode)) {
      e.preventDefault()
      e.stopPropagation()
      return this.onClick()
    }
  }
  private async onClick() {
    try {
      this.cfg.onConfirm && (await this.cfg.onConfirm())
      // this.cfg.__name && (this.$parent[this.cfg.__name] = false)
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

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
