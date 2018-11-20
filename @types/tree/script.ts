

import { Component, Vue } from 'vue-property-decorator'

export interface ITree {
  data: any
  field: string
  maxLevel: number
  editBtn: boolean
  insertBtn: boolean
  removeBtn: boolean
  placeholder: string
  onClick?: (item: any, parent: any) => boolean
  onEdit?: ({ item = {}, parent = {} }, cb) => cb(),
  onCreate?: ({ item = {}, parent = {} }, cb) => cb(),
  onSubmit?: ({ item = {}, parent = {}, value = '' }, cb) => cb(),
  onRemove?: ({ item = {}, parent = {} }, cb) => cb(),


  onConfirm?: () => void
}


const Options = {
  data: null,
  field: 'name',
  maxLevel: 1000,
  editBtn: true,
  insertBtn: true,
  removeBtn: true,
  placeholder: '',
  onClick: (item, parent) => true,
  onEdit: ({ item = {}, parent = {} }, cb) => cb(),
  onCreate: ({ item = {}, parent = {} }, cb) => cb(),
  onSubmit: ({ item = {}, parent = {}, value = '' }, cb) => cb(),
  onRemove: ({ item = {}, parent = {} }, cb) => cb(),
}

@Component({
  props: ['cfg'],
})
export default class App extends Vue {
  private cfg: IAlert

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
      let cb = () => {
        this.editIndex = index
        requestAnimationFrame(() => {
          let inp = elem.parentNode.parentNode.querySelector('.fc-name > input[type="text"]')
          if (inp) {
            inp.value = inp.value
            inp.focus()
          }
        })
      }
      if (typeof this.cfg.onEdit === 'function') {
        return this.cfg.onEdit({ item, parent }, cb)
      }
      return cb()
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
