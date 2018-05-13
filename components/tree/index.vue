<style lang="sass">
  @import "~fancy_style"

  .fancy-tree
    margin: 0 auto
    $lineHeight: 2rem
    $form-height: 2rem
    $colorHover: #f60
    &.fc-0
      padding: $space * 2 0
      > ul
        > li
          padding-left: 0
          &:before,&:after
            border: none
    ul,li
      padding: 0
      margin: 0
      list-style: none
    li
      padding-left: $space * 4
      position: relative
      input
        height: $form-height
        &[type="text"]
          border: 1px solid $borderColor
          line-height: normal
          &:focus
            border-color: $colorAlerm
      // lines
      &::before,
      &::after
        content: ""
        position: absolute
        top: 0
        left: $space
        bottom: 0
        border-left: 1px solid $borderColor
      &::after
        border: none
        top: $lineHeight / 2 + $space
        bottom: auto
        border-top: 1px solid $borderColor
        width: $lineHeight / 2 + $space
      &:last-child
        &::before,
        &::after
          bottom: $lineHeight / 2 + $space
        &::after
          top: auto
      > div
        &:first-child
          display: flex
          align-items: center
          padding: $space
          > .fc-name
            flex: 1
            span
              cursor: pointer
          &:hover
            background: #eee
          // if has children, show arrow
          &:not(:last-child)
            > .fc-arrow
              display: inline-block
              height: $lineHeight
              width: $lineHeight
              position: relative
              cursor: pointer
              margin-left: -$lineHeight/2
              &::before
                content: ""
                position: absolute
                top: 50%
                left: 50%
                height: 0
                width: 0
                border-left: 0.6rem solid #999
                border-top: 0.4rem solid transparent
                border-bottom: 0.4rem solid transparent
                transform-origin: 0 center
                transition: transform 0.2s ease-in
                transform: translate3d(0, -100%, 0) rotate(90deg)
              &:hover
                &::before
                  border-left-color: $colorHover

        .fc-tool
          em
            display: inline-block
            height: $lineHeight
            width: $lineHeight
            opacity: 0.3
            cursor: pointer
            background: url(images/android-create.svg?fill=#{$colorFont}) no-repeat center
            background-size: 80%
            &:hover
              opacity: 1
            &.fc-plus
              background-image: url(images/android-add.svg?fill=#{$colorFont})
            &.fc-trash
              background-image: url(images/ios-trash-outline.svg?fill=#{$colorFont})

      &.fc-folded
        > div
          &:first-child:not(:last-child)
            > .fc-arrow
              &::before
                 transform: translate3d(-50%,-50%,0)
          &:last-child:not(:first-child)
            display: none
</style>

<template lang="pug">
  .fancy-tree(:class="'fc-'+ (treelevel || 0) " v-if="data && data.length")
    ul(v-if="data.length")
      li(:class="{'fc-folded': v.folded}" v-for="(v,index) in data")
        div.fc-item
          .fc-arrow(@click="_toggle(v)")
          .fc-name
            input(
              v-if="!v[cfg.field] || editIndex === index"
              type="text"
              v-bind="{value: v[cfg.field], placeholder: cfg.placeholder, disabled: v.__disabled}"
              @keydown.enter.stop="_submit($event, index, v)"
            )
            span(v-else @click="_toggleName($event, index, v)") {{v[cfg.field]}}

          .fc-tool
            em.fc-pencil(v-if="cfg.editBtn && v.editBtn !== false" @click="_edit($event, index, v)")
            em.fc-plus(v-if="cfg.insertBtn && v[cfg.field] && cfg.maxLevel > (treelevel || 0)" @click="_create($event, index, v)")
            em.fc-trash(v-if="cfg.removeBtn && (!v.data || !v.data.length)" @click="_remove(index, v)")
        treeview(
          v-if="v.data && v.data.length && (treelevel || 0) < cfg.maxLevel"
          v-bind:tree="v"
          v-bind:treelevel="(treelevel || 0) + 1"
          v-bind:treeMaxLevel="maxLevel - 1"
          v-bind:cfg="cfg"
        )
</template>

<script>
const Options = {
  data: null,
  field: 'name',
  maxLevel: 1000,
  editBtn: true,
  insertBtn: true,
  removeBtn: true,
  placeholder: '',
  onClick: (item, parent) => true,
  onEdit: ({ item = {}, parent = {} }) => true,
  onCreate: ({ item = {}, parent = {} }, cb) => cb(),
  onSubmit: ({ item = {}, parent = {}, value = '' }, cb) => cb(),
  onRemove: ({ item = {}, parent = {} }, cb) => cb(),
}

export default {
  name: 'treeview',
  props: ['cfg', 'tree', 'treelevel', 'treeMaxLevel'],
  data() {
    return {
      data: '',
      maxLevel: 0,
      editIndex: false,
    }
  },
  created() {
    let cfg = this.cfg
    typeof this.treelevel === 'undefined' && Object.keys(Options).forEach(i => cfg.hasOwnProperty(i) || this.$set(cfg, i, Options[i]))

    this.data = (this.tree && this.tree.data) || cfg.data
    this.maxLevel = this.treeMaxLevel || cfg.maxLevel
    this.data.forEach(v => this.$set(v, 'folded', typeof v.folded === 'undefined' ? false : v.folded))
  },
  methods: {
    _toggle: item => (item.folded = !item.folded),
    _toggleName(event, index, item) {
      let elem = event.target.parentNode.parentNode
      let res = this.cfg.onClick(item, this.tree || this.cfg)
      res ? this._edit(event, index, item, elem) : this._toggle(item)
    },

    _create(event, index, parent) {
      // parent folded
      this.$set(this.data[index], 'folded', false)
      parent.data || this.$set(this.data[index], 'data', [])
      // default data
      let newItem = {}
      newItem[this.cfg.field] = ''
      newItem['__disabled'] = true
      newItem.data = []

      parent.data.push(newItem)
      let cb = err => {
        if (err) return parent.data.pop()

        newItem['__disabled'] = false
        requestAnimationFrame(() => {
          let node = event.target.parentNode.parentNode.nextElementSibling
          let inp = node.querySelector(':scope > ul > li:last-child').querySelector('input[type="text"]')
          inp && inp.focus()
        })
      }
      if (typeof this.cfg.onCreate === 'function') {
        return this.cfg.onCreate({ item: newItem, parent }, cb)
      }
      return cb()
    },
    _edit(event, index, item, element) {
      let elem = element || event.target
      let parent = this.tree || this.cfg
      let ispure = this.cfg.onEdit({ item, parent })
      if (ispure) {
        this.editIndex = index
        requestAnimationFrame(() => {
          let inp = elem.parentNode.parentNode.querySelector('.fc-name > input[type="text"]')
          if (inp) {
            inp.value = inp.value
            inp.focus()
          }
        })
      }
    },
    _submit(event, index, item) {
      let parent = this.tree || this.cfg
      let value = event.target.value
      let oldVal = item[this.cfg.field]

      if (!value || value === oldVal) {
        oldVal || this.data.splice(index, 1)
        this.editIndex = false
        return
      }

      let cb = err => {
        if (err) {
          oldVal || this.data.splice(index, 1)
        } else {
          item[this.cfg.field] = value
        }
        this.editIndex = false
      }
      if (typeof this.cfg.onSubmit === 'function') {
        return this.cfg.onSubmit({ value, item, parent }, cb)
      }
      return cb()
    },
    _remove(index, item) {
      let cb = err => (err ? false : this.data.splice(index, 1))
      if (typeof this.cfg.onRemove === 'function') {
        return this.cfg.onRemove({ item, parent: this.tree || this.cfg }, cb)
      }
      return cb()
    },
  },
}
</script>
