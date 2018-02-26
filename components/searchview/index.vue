<!-- 即时搜索 -->
<style lang="sass">
  @import "~fancy_style"

  .fancy-searchview
    position: relative
    z-index: 900
    input
      display: inline-block
      height: $form-height
      padding: 0 $space
      margin-right: $space
      min-width: 20rem
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
      min-width: 20rem
      max-height: 20rem
      overflow-y: auto
      border: 1px solid $borderColor
      background: #fff
      margin-top: 1px
    li
      cursor: pointer
      display: block
      overflow: hidden
      height: 2.5em
      line-height: 2.5em
      border-bottom: 1px dashed $borderColor
      padding: 0 0.5rem
      display: -webkit-flex
      display: flex
      flex-wrap：nowrap
      &:last-child
        border: none
      &:hover
        background: #f5f5f5
      &.fc-active
        background: #39f
        color: #fff
      strong
        display: block
        font-weight: normal
        white-space: nowrap
        text-overflow: ellipsis
        overflow: hidden
        flex: 1 1 0
      span
        display: block
        color: #999
    em
      color: red
      font-style: normal
    div
      color: #ccc
      width: 20rem
      line-height: 2.5em
      padding-left: 0.5rem

    @media #{$device-mobile}
      ul,div
        width: 100%
</style>

<template lang="pug">
  .fancy-searchview
    input(
      ref="inp"
      v-bind="cfg.inputAttr"
      v-model="txt"
      @focus="onFocus()"
      @keyup="_kup($event)"
      @keydown="_kdown($event)"
    )
    ul(ref="list" v-if="cfg.data && cfg.data.length > 0")
      li(
        v-for="(v,index) of cfg.data"
        @click="onSelect(v)"
        ,:class="{'fc-active': index == selectIndex}"
      )
        strong(v-html="$options.filters.highlight(v.name, txt)")
    div(v-else v-text="empty")
</template>

<script>
const Options = {
  inputAttr: {
    name: 'name',
    type: 'text',
    placeholder: 'Please keyword',
  },
  fetchUrl: '',
  empty: '无相关搜索结果',
  storageName: '', // 本地存储 名称
  storageNum: 10, // 本地存储 数量
  tarElem: '', // 目标元素
}

export default {
  props: ['cfg'],
  data() {
    return {
      txt: '',
      selectIndex: 0, // 键盘操作时的索引
    }
  },
  created() {
    this.ajaxTimer = null
    Object.keys(Options).forEach(i => this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, Options[i]))
    // document.addEventListener('click', this.onClick) : document.removeEventListener('click', this.onClick)
    // this.txt ? str.replace(new RegExp(this.txt, 'ig'), '<em>' + this.txt + '</em>') : str
  },
  filters: {
    highlight(str, txt) {
      return txt ? str.replace(new RegExp(txt, 'ig'), '<em>' + txt + '</em>') : str
    },
  },
  mounted() {},
  methods: {
    onClick(e) {
      e.stopPropagation()
      this.data = false
    },
    onFocus() {
      // let storage = this.storageName
      // this.data = storage ? Util.storage.get(storage) || false : false
    },
    _kdown(e) {
      e.preventDefault()
      e.stopPropagation()
      // $(this.$els.ul)
      //   .find('li')
      //   .eq(this.index)
      //   .trigger('click')
    },
    _kup(e) {
      e.preventDefault()
      e.stopPropagation()

      let self = this
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
        clearTimeout(this.ajaxTimer)
        this.ajaxTimer = setTimeout(() => {
          this.getData(self.txt)
        }, 300)
      }
    },
    onSelect(v) {
      this.txt = v.name
      this.id = v.id
      this.data = false

      // 本地存储
      let storage = this.storageName
      let num = this.storageNum
      if (storage && num > 0) {
        let history = Util.storage.get(storage) || []
        let find = history.findIndex(value => value.id === v.id)
        if (find == -1) {
          history.push(v)
          Util.storage.set(storage, history.splice(-num))
        }
      }
    },
    getData(keywords, type) {
      let self = this
      if (!self.url) return
      if (keywords.length == 0) {
        self.data = false
        return
      }

      $.ajax({
        url: self.url,
        data: {
          keywords: keywords,
        },
        type: 'post',
        dataType: 'json',
        success: res => {
          self.index = 0
          if (res.code == 100) {
            self.data = res.data
          } else {
            self.data = false
          }
        },
      })
    },
  },
}
</script>

