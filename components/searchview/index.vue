<!-- 即时搜索 -->
<style lang="sass">
  @import "~fancy_style"
  .fancy-searchview
    position: relative
    z-index: 900
    > div,
    > ul
      position: absolute
      left: 0
      top: $form-height
      width: 30rem
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
  .fancy-searchview(@click.stop="")
    input(
      type="text"
      name="{{name}}"
      placeholder="{{placeholder}}"
      v-model="txt"
      @focus="onFocus()"
      @keydown.enter.stop="onEnter()"
      @keydown="onKeyup($event)"
    )
    template(v-if="typeof data === 'object'")
      ul(v-if="data.length > 0" v-el:ul)
        li(
          v-for="(key,v) in data"
          @click="onSelect(v)"
          v-bind:class="{'fc-active': key == index}"
        )
          strong(v-html="v.name | highlight")
          span(v-text="city(v.cityid).name")
      div(v-else v-text="empty")
</template>

<script>
const Options = {
  id: 'id', // id表单
  name: 'name', // name表单
  url: '', // ajax url
  empty: '无相关搜索结果',
  placeholder: '输入关键字',
  storageName: '', // 本地存储 名称
  storageNum: 10, // 本地存储 数量
  tarElem: '', // 目标元素
}

export default {
  props: ['cfg'],
  data() {
    return {
      id: '',
      txt: '',
      data: false, // 结果数据
      index: 0, // 键盘操作时的索引
    }
  },
  created() {
    this.ajaxTimer = null
    let cfg = this.cfg
    Object.keys(Options).forEach(i => cfg.hasOwnProperty(i) || this.$set(cfg, i, Options[i]))
  },
  mounted() {
  },
  watch: {
    cfg: {
      handler(val) {
        Object.assign(this.$data, val)
      },
      deep: true,
    },
    tarElem(val) {
      val && this.$appendTo(val)
    },
    data(val) {
      typeof val === 'object' ? document.addEventListener('click', this.onClick) : document.removeEventListener('click', this.onClick)
    },
  },
  filters: {
    highlight(str) {
      return this.txt ? str.replace(new RegExp(this.txt, 'ig'), '<em>' + this.txt + '</em>') : str
    },
  },
  methods: {
    onClick(e) {
      e.stopPropagation()
      this.data = false
    },
    onFocus() {
      // let storage = this.storageName
      // this.data = storage ? Util.storage.get(storage) || false : false
    },
    onEnter() {
      $(this.$els.ul)
        .find('li')
        .eq(this.index)
        .trigger('click')
    },
    onKeyup(e) {
      let self = this
      // 回车键
      if (e.keyCode == 13) return
      // 上下键移动
      if (e.keyCode == 38 || e.keyCode == 40) {
        let len = self.data.length
        if (len == 0) return
        self.index += e.keyCode == 40 ? 1 : -1
        if (self.index < 0) {
          self.index = len - 1
        } else if (self.index >= len) {
          self.index = 0
        }
        // 滚动效果不好
        // $(self.$els.ul).children().eq( self.index )[0].scrollIntoView(true)
      } else {
        clearTimeout(self.ajaxTimer)
        self.ajaxTimer = setTimeout(() => {
          self.getData(self.txt)
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

