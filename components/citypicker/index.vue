<style lang="sass">
  @import "~fancy_style"
  @import "~fancy_mixins"

  .fancy-citypicker
    @include mixin-mask()
    padding: $space * 4 0
    > div
      height: 100%
      margin: 0 auto
      max-width: 30rem
      display: flex
      flex-direction: column
      background: #fff
    h4
      margin: 0
      height: $row-height
      border-bottom: 2px solid $colorTheme
      display: flex
      align-items: center
      span
        flex: 1
        display: block
        color: $colorTheme
        text-align: center
      em
        cursor: pointer
        display: block
        width: $row-height
        height: $row-height
        background: url(images/android-close.svg?fill=#{$colorTheme}) no-repeat center
        background-size: 70% auto
        &:hover
          opacity: 0.5
        &.fc-delete
          background-image: url(images/ios-trash-outline.svg?fill=#{$borderColor})
        &.fc-back
          background-image: url(images/android-arrow-back.svg?fill=#{$colorTheme})
    ul
      flex: 1
      overflow-y: auto
      overflow-x: hidden
      li
        position: relative
        padding: 0 1rem 0 2rem
        line-height: $row-height
        border-bottom: 1px solid $borderColor
        cursor: pointer
        &.fc-active
          background: #eee
        &:hover
          background: #f8f8f8
        &::before,&::after
          content: ""
          position: absolute
          left: 1rem
          top: 50%
          width: 1rem
          height: 1rem
          border: 1px solid $colorTheme
          border-radius: 100%
          box-sizing: border-box
          transform: translate3d(-50%, -50%, 0)
        &.fc-chked::after
          width: 0.6rem
          height: 0.6rem
          background: $colorTheme

    @media #{$device-phone}
      > div
        max-width: 90%
    @media #{$device-pad}
      > div
        max-width: 60%

</style>

<template lang="pug">
  .fancy-citypicker(@click="_close")
    div(@click.stop="")
      h4
        em.fc-back(v-if="level" @click="_back()")
        em.fc-delete(v-else @click="_clear()")
        span {{title}}
        em(@click="_close")

      ul(ref="picker")
        li(
          v-for="(v,k) of children"
          v-bind:class="{'fc-chked': current.id == v.id, 'fc-active': index == k }"
          v-text="v.name"
          @click="_choose(k, v)"
        )
</template>

<script>

  import City from './city.js'

  const Options = {
    value: '',  //cityid
    maxLevel: 2,
    onSelect(cityid, cityname, path) {console.log(cityid)},
    __name: 'citypicker',
  }
  export default {
    props: ['cfg'],
    data() {
      return {
        current: {},
        level: 0,
        index: 0, // keyboard index
        breadcrumbs: [],
      }
    },
    created() {
      Object.keys(Options).forEach(i => {
        (i in this.cfg) || this.$set(this.cfg, i, Options[i])
      })
      this._getdata(this.cfg.value)
      document.addEventListener('keydown', this._kdown, false)
    },
    destroyed() {
      document.removeEventListener('keydown', this._kdown, false)
    },
    computed: {
      title() {
        return City.category[this.level]
      },
      children() {
        let id = 0
        let fid = 0
        let level = this.level
        let getChild = function(fid) {
          let arr = []
          if (!fid) {
            // 第一级,按顺序显示
            for (let n of City.province) {
              for (let v of City.data) {
                if (v.fid == 0 && v.name === n) {
                  arr.push(v)
                  break
                }
              }
            }
          } else {
            // 第n级
            for (let v of City.data) {
              if (v.fid == fid) arr.push(v)
            }
          }
          return arr
        }
        level && ({
          id,
          fid
        } = this.breadcrumbs[level - 1])
        // 直辖市 或 最后一级
        return (City.zxs.indexOf(id) >= 0 || (level > 0 && level == this.cfg.maxLevel)) ?
          [] :
          getChild(id)
      },
    },
    methods: {
      _getdata(val) {
        if (val) {
          let parents = City.getPath(val)
          if (parents) {
            this.breadcrumbs = parents
            this.level = parents.length - 1
            this.current = City.getByID(val) || ''

            let index = this.children.findIndex((value, index, arr) => value.id == this.current.id)
            this.index = index < 0 ? 0 : index
          }
        }
      },
      _scrollview() {
        let list = this.$refs.picker.children
        if (this.index >= list.length) {
          this.index = 0
        }
        list[this.index].scrollIntoView(false)
      },
      _kdown(e) {
        if ([8, 13, 27, 37, 38, 39, 40, 100].includes(e.keyCode)) {
          e.preventDefault()
          e.stopPropagation()
          // Esc
          if (27 == e.keyCode) return this._close()
          // enter
          if ([13, 100].includes(e.keyCode)) return this._choose(this.index, this.children[this.index])
          // let back
          if ([8, 37].includes(e.keyCode)) return this._back()

          let max = this.children.length || 1
          // up down
          if ([38, 40].includes(e.keyCode)) {
            this.index += e.keyCode == 40 ? 1 : -1
            if (this.index < 0) {
              this.index = max - 1
            } else if (this.index == max) {
              this.index = 0
            }
            this._scrollview()
          }
        }
      },
      _choose(index, item) {
        this.index = index
        this.current = item
        this.breadcrumbs = this.breadcrumbs.slice(0, this.level)
        this.breadcrumbs.push(item)
        this.level++
        if (!this.children.length) {
          this.cfg.onSelect && this.cfg.onSelect(item.id, item.name, this.breadcrumbs)
          this.level--
          this._close()
        }
      },
      _clear() {
        this.level = 0
        this._close()
        this.cfg.onSelect && this.cfg.onSelect('', '')
      },
      _back() {
        if (this.level == 0) return
        this.level--
        this.current = this.breadcrumbs[this.level]
        let index = this.children.findIndex((value, index, arr) => value.id == this.current.id)
        this.index = Math.max(0, index)
        this._scrollview()
      },
      _close() {
        this.cfg.__name && (this.$parent[this.cfg.__name] = false)
      }
    },
  }
</script>
