<style lang="sass">
  @import "~fancy_style"

  $max-width: 15rem
  $blue: rgba(#09c,0.6)

  $bg : #22282e
  $bg-hover: #414d5c
  $font-color: #ddd
  $icon-color: #71808f
  $size: $form-height

  .fancy-sidebar
    position: fixed
    top: 0
    left: 0
    z-index: 1000
    color: $font-color

    &.fc-state
      > .fc-switch
        opacity: 0.2
        left: 0
        &::after
          transform: translate3d(20%, -100%, 0) rotatez(-90deg)
        &:hover
          opacity: 1
      > .fc-wrap
        width: 0

    > .fc-switch
      position: fixed
      top: 0
      bottom: 0
      left: $max-width
      width: $size / 3
      z-index: 1000
      cursor: pointer
      transition: left 0.3s
      overflow: hidden
      &::before,
      &::after
        content: ""
        position: absolute
        top: 50%
        left: 0
      &::before
        right: 0
        height: $size * 2
        border-top-right-radius: 3px
        border-bottom-right-radius: 3px
        background: $bg
        transform: translate3d(0, -50%, 0)
      &::after
        width: 0
        height: 0
        border-left: $size / 5 solid transparent
        border-right: $size / 5 solid transparent
        border-top: $size / 5 solid $blue
        transform-origin: center bottom
        transform: translate3d(-40%, -100%, 0) rotatez(90deg)

    > .fc-wrap
      position: fixed
      top: 0
      left: 0
      bottom: 0
      width: $max-width
      overflow: hidden
      transition: width 0.3s
      background: #293038
      > div
        position: absolute
        top: 0
        left: 0
        bottom: 0
        width: $max-width + 2   // to hide scrollbar
        overflow-x: hidden
        overflow-y: scroll
      dl
        &.fc-fold
          dt
            &:after
              transform: rotate(135deg)
          dd
            height: 0
      dt,
      dd
        position: relative
        height: $size
        line-height: $size
        overflow: hidden
        &:hover
          background-color: $bg-hover
      dt
        background: $bg
        padding-left: $size
        cursor: pointer
        color: #999
        &::before
          content: ""
          position: absolute
          left: 0
          top: 0
          width: $size
          height: $size
          background-repeat: no-repeat
          background-position: center
          background-size: 60%
        &::after
          content: ""
          position: absolute
          top: calc(50% - 0.4rem)
          right: 3rem
          height: 0.7rem
          width: 0.7rem
          border-right: 1px solid currentColor
          border-bottom: 1px solid currentColor
          transform-origin: center center
          transform: rotate(45deg) translate3d(-30%,0,0)
          transition: transform 0.2s ease-in

        &.fc-automobile
          &::before
            background-image: url(images/model-s.svg?fill=#{$icon-color})
        &.fc-sitemap
          &::before
            background-image: url(images/android-apps.svg?fill=#{$icon-color})
        &.fc-cubes
          &::before
            background-image: url(images/merge.svg?fill=#{$icon-color})
        &.fc-cog
          &::before
            background-image: url(images/gear-a.svg?fill=#{$icon-color})
      dd
        transition: height 0.2s ease-in
        color: $font-color
        &.fc-active
          background: $blue
          color: #fff
        a
          display: block
          text-decoration: none
          color: currentColor
          padding-left: $size
          &:focus
            outline: none

    @media #{$device-mobile}
      > .fc-switch
        left: 10rem
      > .fc-wrap
        width: 10rem
        overflow: hidden
</style>

<template lang="jade">
  .fancy-sidebar(:class="{'fc-state': state}")
    .fc-switch(@click="_setState()")
    .fc-wrap
      div
        dl(v-for="(v, k) in cfg.data" v-bind:class="{'fc-fold': folded[k]}")
          dt(:class="'fc-'+ v.icon" @click="_setFold(k,v)") {{v.name}}
          dd(v-for="v of v.children" v-bind:class="{'fc-active': v.id == cfg.active}")
            a(
              v-bind="{href: v.url || 'javascript:', target: v.target || '_self', title: v.name}"
              @click="v.callback ? v.callback(v) : ''"
            ) {{v.name}}
</template>

<script>
const Options = {
  data: null,
  active: '',
  onSlide(bool) { },
  callback(data) { },
}
export default {
  props: ['cfg'],
  data() {
    return {
      state: false,
      folded: {},
    }
  },
  created() {
    Object.keys(Options).forEach(i => {
      (i in this.cfg) || this.$set(this.cfg, i, Options[i])
    })
    let storage = this.cfg.callback() || {}
    this.state = storage.state || false
    this.folded = storage.folded || {}

    this._updateFold(this.cfg.data)
  },
  watch: {
    state(val) {
      this.cfg.onSlide(val)
    },
    'cfg.data'(val) {
      this._updateFold(val)
    },
  },
  methods: {
    _setState() {
      this.state = !this.state
      this.cfg.callback(this.state, this.folded)
    },
    _setFold(name, item) {
      this.folded[name] = !this.folded[name]
      this.cfg.callback(this.state, this.folded)
    },
    _updateFold(val) {
      for (let i in val) {
        this.$set(this.folded, i, this.folded[i] || false)
      }
    },
  },
}
</script>

