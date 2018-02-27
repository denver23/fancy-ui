<!-- 即时搜索 -->
<style lang="sass">
  @import "~fancy_style"
  $size: 20rem
  .fancy-searchview
    position: relative
    z-index: 900
    input
      display: inline-block
      height: $form-height
      padding: 0 $space
      margin-right: $space
      min-width: $size
      color: $colorFont
      border: 1px solid $borderColor
      -webkit-appearance: none
      border-radius: 0
      &:focus
        border: 1px solid $colorAlerm
        outline: none
    > div,
    > ul
      position: absolute
      left: 0
      top: $form-height
      min-width: $size
      max-height: $size
      overflow-y: auto
      border: 1px solid $borderColor
      background: #fff
      margin-top: 1px
    li
      cursor: pointer
      display: block
      overflow: hidden
      height: $row-height
      line-height: $row-height
      border-bottom: 1px dashed $borderColor
      padding: 0 $space
      display: flex
      flex-wrap：nowrap
      &:last-child
        border: none
      &:hover
        background: rgba($colorTheme, 0.3)
      &.fc-active
        background: $colorTheme
        color: #fff
      span
        display: block
        white-space: nowrap
        text-overflow: ellipsis
        overflow: hidden
        flex: 1 1 0
      em
        color: $colorAlerm
        font-style: normal
    div
      color: $colorDisable
      width: $size
      line-height: $row-height
      padding-left: $space

    @media #{$device-mobile}
      ul,div
        width: 100%
</style>

<template lang="pug">
  .fancy-searchview
    input(
      ref="inp"
      type="text"
      v-bind="[cfg.attr]"
      v-model="cfg.value"
      @focus="_focus($event)"
      @blur="_blur()"
      @keyup="_kup($event)"
      @keydown="_kdown($event)"
      autocomplete="off"
    )
    template(v-if="show")
      ul(ref="list" v-if="cfg.data && cfg.data.length > 0")
        li(
          v-for="(v,index) of cfg.data",
          :class="{'fc-active': index == selectIndex}"
          @click="_choose(v)"
        )
          span(v-html="$options.filters.highlight(v.name, cfg.value)")
      div(v-else v-text="cfg.empty")
</template>

<script>
const Options = {
  attr: {},
  data: '',
  value: '',
  empty: '',
  onChange() {},
  onChoose: item => console.log(item),
}

export default {
  props: ['cfg'],
  data() {
    return {
      show: false,
      selectIndex: -1,
    }
  },
  created() {
    Object.keys(Options).forEach(i => this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, Options[i]))
  },
  filters: {
    highlight: (str, val) => (val ? str.replace(new RegExp(val, 'ig'), `<em>${val}</em>`) : str),
  },
  watch: {
    show(val) {
      if (val && this.cfg.value && this.cfg.data) {
        let index = this.cfg.data.findIndex(v => v.name === this.cfg.value)
        requestAnimationFrame(() => this.$refs.list.children[index].scrollIntoView(false))
      }
    },
  },
  mounted() {},
  methods: {
    _focus(e) {
      e.preventDefault()
      this.show = true
    },
    _blur() {
      setTimeout(() => (this.show = false), 200)
    },
    _kdown(e) {
      if ([13, 38, 40].includes(e.keyCode)) {
        e.preventDefault()
        e.stopPropagation()
      }
      // enter
      if (e.keyCode == 13) {
        return this._choose()
      }
    },
    _kup(e) {
      if ([13, 38, 40].includes(e.keyCode)) {
        e.preventDefault()
        e.stopPropagation()
      }
      // enter
      if (e.keyCode == 13) return
      // up down key
      if (e.keyCode == 38 || e.keyCode == 40) {
        let len = this.cfg.data.length
        if (len == 0) return
        this.selectIndex += e.keyCode == 40 ? 1 : -1
        if (this.selectIndex < 0) {
          this.selectIndex = len - 1
        } else if (this.selectIndex >= len) {
          this.selectIndex = 0
        }
        this.$refs.list.children[this.selectIndex].scrollIntoView(false)
      } else {
        this.cfg.onChange.call(this, this.cfg.value)
      }
    },
    _choose(v) {
      if (this.selectIndex < 0) return
      let item = v || this.cfg.data[this.selectIndex]
      this.cfg.onChoose(item)
      this.show = false
      this.cfg.value = item.name
    },
  },
}
</script>

