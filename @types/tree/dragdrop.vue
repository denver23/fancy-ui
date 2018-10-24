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
      // margin: $space/2 0
      &.fc-enter
        > div
          &:first-child
            background: rgba(red, 0.2)
            &:hover
              background: rgba(red, 0.2)
      &.fc-prev
        > div
          &:first-child
            &::before
              top: 0
              border-top: 2px solid red
            &:hover
                background: rgba(red, 0.2)
      &.fc-next
        > div
          &:first-child
            &::before
              bottom: 0
              border-top: 2px solid red
            &:hover
                background: rgba(red, 0.2)
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
          position: relative
          &::before
            content: ''
            position: absolute
            left: 0
            right: 0
          > .fc-name
            flex: 1
            span
              display: inline-block
              cursor: pointer
              line-height: $lineHeight
          &:hover
            background: rgba($borderColor, 0.2)
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
                transform: translate3d(-50%,-50%,0)
              &:hover
                &::before
                  border-left-color: $colorHover

        &:last-child:not(:first-child)
          display: none

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

      &.fc-open
        > div
          &:first-child:not(:last-child)
            > .fc-arrow
              &::before
                 transform: translate3d(0, -100%, 0) rotate(90deg)
          &:last-child:not(:first-child)
            display: block

</style>

<template lang="pug">
  .fancy-tree(:class="'fc-'+ (treelevel || 0) " v-if="data && data.length")
    ul(v-if="data.length")
      li(
        :fancy-tree-id="dnd.rid",
        :class="{'fc-open': v.open, 'fc-enter': v.__path === dnd.path, 'fc-prev': v.__path === dnd.path && dnd.prev, 'fc-next': v.__path === dnd.path && dnd.next }"
        v-for="(v,index) in data"
        draggable="true"
        @dragend="_dragEnd($event)"
        @dragover="_dragOver($event, v, ___tree)"
        @dragstart="_dragStart($event, v, ___tree)"
        @dragenter="_dragEnter($event, v, ___tree)"
      )
        div.fc-item
          .fc-arrow(@click="_toggle(v)")
          .fc-name
            span
              input(
                v-if="!v[cfg.field] || editIndex === index"
                type="text"
                v-bind="{value: v[cfg.field], placeholder: cfg.placeholder, disabled: v.__disabled}"
                @keydown.enter.stop="_submit($event, index, v)"
              )
              span(v-else @click="_toggleName($event, index, v)") {{v[cfg.field]}}

          .fc-tool
            em.fc-pencil(v-if="cfg.editBtn && v.editBtn !== false" @click="_edit($event, index, v)")
            em.fc-plus(v-if="cfg.insertBtn && v[cfg.field] && cfg.maxLevel > (treelevel || 0)" @click="_add($event, index, v)")
            em.fc-trash(v-if="cfg.removeBtn && (!v.data || !v.data.length)" @click="_remove(index, v)")
        treeview(
          v-if="v.data && v.data.length && (treelevel || 0) < cfg.maxLevel",
          :tree="v",
          :treePath="v.__path",
          :treelevel="(treelevel || 0) + 1",
          :treeMaxLevel="maxLevel - 1",
          :cfg="cfg"
        )
</template>

<script>
// import Vue from 'vue'
const Options = {
  data: null,
  field: 'name',
  maxLevel: 1000,
  editBtn: true,
  insertBtn: true,
  removeBtn: true,
  placeholder: '',
  onClick: (item, parent) => true,
  onCreate: (item, parent, isCreate) => true,
  onEdit: (item, parent, isCreate) => true,
  onSubmit(value, item, parent) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 1000)
    })
  },
  onRemove(item, parent) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 1000)
    })
  },
}

// 生成随机id
function generateid(n) {
  let a = []
  a[n || 8] = ''
  return a.join('x').replace(/[xy]/g, c => {
    let r = (Math.random() * 16) | 0
    let v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

let foldTarget = false
let dnding = false
let dnd = {
  rid: `fancy-tree-${generateid()}`,
  path: '',
  source: null,
  target: null,
  sourceTree: null,
  targetTree: null,
  prev: false,
  next: false,
}

export default {
  name: 'treeview',
  props: ['cfg', 'tree', 'treelevel', 'treeMaxLevel', 'treePath'],
  data() {
    return {
      data: '',
      maxLevel: 0,
      editIndex: false,
      dnd,
      ___tree: null,
    }
  },
  created() {
    typeof this.treelevel === 'undefined' &&
      Object.keys(Options).forEach(i => {
        i in this.cfg || this.$set(this.cfg, i, Options[i])
      })

    this.data = (this.tree && this.tree.data) || this.cfg.data
    this.maxLevel = this.treeMaxLevel || this.cfg.maxLevel
    this.___tree = this
  },
  watch: {
    data(val) {
      val &&
        val.forEach((v, i) => {
          this.$set(v, 'open', typeof v.open === 'undefined' ? true : v.open)
          this.$set(v, '__path', (this.treePath || 'path') + '_' + i)
        })
    },
  },
  methods: {
    _toggle: item => (item.open = !item.open),
    _toggleName(event, index, item) {
      let elem = event.target.parentNode.parentNode
      let res = this.cfg.onClick(item, this.tree || this.cfg)
      res ? this._edit(event, index, item, elem) : this._toggle(item)
    },
    _add(event, index, parent) {
      // parent open
      this.$set(this.data[index], 'open', true)
      parent.data || this.$set(this.data[index], 'data', [])

      // default data
      let newItem = {}
      newItem[this.cfg.field] = ''
      newItem['__disabled'] = true
      newItem.data = []

      parent.data.push(newItem)
      let ispure = this.cfg.onCreate(newItem, parent, true)
      if (ispure) {
        newItem['__disabled'] = false
        requestAnimationFrame(() => {
          let inp = event.target.parentNode.parentNode.nextElementSibling.querySelector(':scope > ul > li:last-child').querySelector('input[type="text"]')
          inp && inp.focus()
        })
      }
    },
    _edit(event, index, item, element) {
      let elem = element || event.target
      let parent = this.tree || this.cfg
      let ispure = this.cfg.onEdit(item, parent, false)
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
    _submit: async function(event, index, item) {
      let parent = this.tree || this.cfg
      let newVal = event.target.value
      let oldVal = item[this.cfg.field]

      if (!newVal || newVal === oldVal) {
        oldVal || this.data.splice(index, 1)
        this.editIndex = false
        return
      }
      try {
        await this.cfg.onSubmit(newVal, item, parent)
        item[this.cfg.field] = newVal
      } catch (e) {
        oldVal || this.data.splice(index, 1)
      }
      this.editIndex = false
    },
    _remove: async function(index, item) {
      try {
        await this.cfg.onRemove(item, this.tree || this.cfg)
        this.data.splice(index, 1)
      } catch (e) {}
    },
    _dragStart(event, item, instance) {
      event.stopPropagation()
      if (dnding) return
      dnding = true
      dnd.source = item
      dnd.sourceTree = instance
    },
    _dragOver(event, item) {
      event.preventDefault()
      event.stopPropagation()
      if (item.__path.includes(dnd.source.__path)) {
        dnd.prev = false
        dnd.next = false
        return
      }
      let target = event.target.closest('li')
      if (!target || target.getAttribute('fancy-tree-id') !== dnd.rid) return

      let x = event.pageX - window.scrollX
      let y = event.pageY - window.scrollY
      // div
      let h3 = 10
      let rect = target.childNodes[0].getBoundingClientRect()
      let topRect = {
        x1: rect.left,
        y1: rect.top,
        x2: rect.right,
        y2: rect.top + h3,
      }
      let bottomRect = {
        x1: rect.left,
        y1: rect.bottom - h3,
        x2: rect.right,
        y2: rect.bottom,
      }
      if (x >= topRect.x1 && x <= topRect.x2 && y >= topRect.y1 && y <= topRect.y2) {
        dnd.prev = true
        dnd.next = false
        return
      }
      if (x >= bottomRect.x1 && x <= bottomRect.x2 && y >= bottomRect.y1 && y <= bottomRect.y2) {
        dnd.prev = false
        dnd.next = true
        return
      }
      dnd.prev = false
      dnd.next = false
    },
    _dragEnter(event, item, instance) {
      event.preventDefault()
      event.stopPropagation()
      if (item.__path.includes(dnd.source.__path)) {
        dnd.target = null
        dnd.path = ''
        return
      }
      item.open = true
      dnd.path = item.__path
      dnd.target = item
      dnd.targetTree = instance
    },
    _dragEnd(event) {
      event.preventDefault()
      event.stopPropagation()
      if (!dnd.target || dnd.target.__path.includes(dnd.source.__path)) {
        return this._clear()
      }
      if (dnd.prev || dnd.next) {
        return this._dragMove(dnd.prev ? 'toPrev' : 'toNext')
      }
      this._dragMove()
    },
    _dragMove(where) {
      let el = this.$el
      let source = dnd.source
      let target = dnd.target
      let sourceData = dnd.sourceTree.data
      let targetData = dnd.targetTree.data

      if (!source || !target) return this._clear()

      // prev or next
      if (where) {
        if (dnd.targetTree === dnd.sourceTree) {
          // same origin
          // insert
          let to = targetData.findIndex(v => v === dnd.target)
          if (where === 'toNext') {
            to++
          }
          targetData.splice(to, 0, source)
          // delete
          let from = sourceData.findIndex((v, index) => v === dnd.source && index !== to)
          sourceData.splice(from, 1)
        } else {
          // different origin
          let to = targetData.findIndex(v => v === dnd.target)
          let from = sourceData.findIndex(v => v === dnd.source)
          if (where === 'toNext') {
            to++
          }
          sourceData.splice(from, 1)
          targetData.splice(to, 0, source)
        }

        // vue update
        dnd.sourceTree.data = []
        dnd.targetTree.data = []
        requestAnimationFrame(() => {
          dnd.sourceTree.data = sourceData
          dnd.targetTree.data = targetData
          this._clear()
        })
        return
      }

      // delete
      sourceData.splice(sourceData.findIndex(v => v === source), 1)

      let targetChild = target.data || []
      targetChild.push(source)

      dnd.sourceTree.data = []
      target.data = []
      requestAnimationFrame(() => {
        dnd.sourceTree.data = sourceData
        this.$set(target, 'data', targetChild)
        target.open = true

        this._clear()
        return
      })
    },
    _clear() {
      dnd.path = ''
      dnd.source = null
      dnd.target = null
      dnd.sourceTree = null
      dnd.targetTree = null
      dnd.prev = false
      dnd.next = false
      dnding = false
    },
  },
}
</script>
