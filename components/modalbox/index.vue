<!-- 组件 模态框 -->
<style lang="sass">
  @import "~fancy_style"
  @import "~fancy_mixins"

  .fancy-modalbox
    @keyframes fancy-modalbox-loading
      0%
        transform: rotate(0deg)
      100%
        transform: rotate(359deg)
    &.fc-mask
      @include mixin-mask()
      > div
        border: none

    > div
      position: absolute
      top: 50%
      left: 50%
      max-width: 96%
      border: 1px solid $borderColor
      border-radius: $borderRadius
      overflow: hidden
      background: #fff
      transform: translate3d(-50%, -50%, 0)

      &.fc-fixed
        position: fixed
        max-height: 100%
        overflow: auto
        display: flex
        flex-direction: column
        & > div
          overflow: auto
      .fc-title
        line-height: $row-height
        min-height: $row-height
        padding: 0 0 0 0.5rem
        margin: 0
        background: $colorTheme
        color: #fff
        display: flex
        strong
          cursor: move
          flex: 1 1 0
        label
          @include mixin-close( $size: $row-height, $hoverBgcolor: #ce2230, $color: #fff )

    .fc-loading
      height: $form-height * 2
      position: relative
      &::before
        content: ""
        position: absolute
        top: 0
        bottom: 0
        left: 0
        right: 0
        background: url(images/spinner.svg?fill=#{$colorTheme}) no-repeat center
        background-size: auto 25%
        animation: fancy-modalbox-loading 1s infinite steps(8)

    .fc-content
      min-height: $form-height
      padding: $space * 2 $space
      box-sizing: border-box

    .fc-tips
      text-align: center
      padding: 0 0 $space * 2
      span
        color: $colorAlerm
        display: inline-block
        animation: fancy-modalbox-cite 0.5s 2 ease-in forwards
        @keyframes fancy-modalbox-cite
          0%,100%
            transform: translate3d(0, 0, 0)
          25%
            transform: translate3d(-$space, 0, 0)
          75%
            transform: translate3d($space, 0, 0)

    .fc-btns
      display: flex
      > span
        flex: 1
        cursor: pointer
        text-align: center
        line-height: $form-height
        margin: 0 $space $space
        border-radius: 2px
        background: $colorTheme
        color: #fff
        &:hover
          opacity: 0.8
        &:nth-child(2)
          margin-left: 0
          background: $colorDisable
        &:first-child:last-child
          margin: 0
        em
          font-style: normal
          position: relative
        &.fc-sending
          em
            &::after
              content: ""
              position: absolute
              height: $form-height
              width: $form-height
              background: url(images/spinner.svg?fill=#fff) no-repeat center center
              background-size: auto 50%
              animation: fancy-modalbox-loading 1s infinite steps(8)

    // @media #{$device-phone}
    //   > div
    //     min-width: 60%
    // @media #{$device-pad}
    //   > div
    //     min-width: 40%

</style>

<template lang="pug">
  .fancy-modalbox(:class="cfg.overlay ? 'fc-mask' : 'fc-nomask'" v-if="cfg.content")
    div(:style="cfg.style" ref="box")
      .fc-title(v-if="cfg.title" ref="title")
        strong(v-html="cfg.title")
        label(@click="_done(0)")

      .fc-loading(v-if="cfg.content === 'loading'")
      .fc-wrap(v-else)
        component(:is="cfg.component" v-bind:cfg="cfg.content" v-if="cfg.component")
        .fc-content(v-else v-html="cfg.content")

      .fc-tips(v-if="cfg.tips")
        span(v-text="cfg.tips")
      .fc-btns(v-if="cfg.confirm || cfg.cancel")
        span(:class="{'fc-sending': sending === 'confirm'}" v-if="cfg.confirm" @click="_done(1)")
          em {{cfg.confirm}}
        span(:class="{'fc-sending': sending === 'cancel'}" v-if="cfg.cancel" @click="_done(0)")
          em {{cfg.cancel}}
</template>

<script>
import Drag from 'lib/drag'
import { setTimeout } from 'timers'

const Options = {
  title: '',
  content: '',
  confirm: 'confirm',
  cancel: 'cancel',
  tips: '',
  component: '', // component组件

  overlay: true,
  draggable: true,
  onComplete(el) {},
  onConfirm(el) {},
  onCancel() {},
}

export default {
  props: ['cfg'],
  data() {
    return { sending: false }
  },
  created() {
    Object.keys(Options).forEach(i => this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, Options[i]))
  },
  mounted() {
    this.cfg.content !== 'loading' && this.cfg.onComplete && this.cfg.onComplete(this.$el)
    this.cfg.draggable && Drag.init(this.$refs.title || this.$refs.box, this.$refs.box)
    document.addEventListener('keydown', this._kdown, false)
  },
  destroyed() {
    document.removeEventListener('keydown', this._kdown, false)
  },
  watch: {
    'cfg.content'(val) {
      requestAnimationFrame(() => val !== 'loading' && this.cfg.onComplete && this.cfg.onComplete(this.$el))
    },
  },
  methods: {
    _kdown(e) {
      if (this.cfg.content) {
        // enter space
        if (this.cfg.confirm && [13, 100, 32].includes(e.keyCode)) {
          e.preventDefault()
          e.stopPropagation()
          return this._done(1)
        }
        // esc
        if (e.keyCode == 27) this._done(0)
      }
    },
    _done: async function(type) {
      if (this.sending) return
      this.sending = type
      try {
        type ? await this.cfg.onConfirm(this.$el) : await this.cfg.onCancel()
      } catch (e) {}
      this.sending = false
    },
  },
}
</script>

