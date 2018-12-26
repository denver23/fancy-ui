import { Component, Prop, Vue } from 'vue-property-decorator'

export interface ITree {
  data: any
  field?: string
  maxLevel?: number
  editBtn?: boolean
  insertBtn?: boolean
  removeBtn?: boolean
  placeholder?: string
  onClick?: (item: any, parent: any) => boolean
  onEdit?: (param: object, cb: () => void) => void
  onCreate?: (param: object, cb: () => void) => void
  onSubmit?: (param: object, cb: () => void) => void
  onRemove?: (param: object, cb: () => void) => void
}

const options: ITree = {
  data: null,
  field: 'name',
  maxLevel: 1000,
  editBtn: true,
  insertBtn: true,
  removeBtn: true,
  placeholder: '',
  onClick: (item, parent) => true,
  onEdit: (param, cb) => cb(),
  onCreate: (param, cb) => cb(),
  onSubmit: (param, cb) => cb(),
  onRemove: (param, cb) => cb(),
}

@Component
export default class App extends Vue {
  @Prop() private cfg: ITree
  private tree: any
  private treelevel: number | undefined
  private treeMaxLevel: number

  private data: any = ''
  protected maxLevel: number = 0
  protected editIndex: number | boolean = false

  protected created() {
    const cfg = this.cfg
    typeof this.treelevel === 'undefined' &&
      Object.keys(options).forEach(i => {
        this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
      })

    this.data = (this.tree && this.tree.data) || cfg.data
    this.maxLevel = this.treeMaxLevel || cfg.maxLevel
    this.data.forEach((v: any) => this.$set(v, 'folded', typeof v.folded === 'undefined' ? false : v.folded))
  }

  protected toggle(item: any) {
    item.folded = !item.folded
  }

  protected toggleName(event: MouseEvent, index: number, item: any) {
    const elem = (event.target as any).parentNode.parentNode
    const res = this.cfg.onClick(item, this.tree || this.cfg)
    res ? this.onEdit(event, index, item, elem) : this.toggle(item)
  }

  protected onCreate(event: MouseEvent, index: number, parent: any) {
    // parent folded
    this.$set(this.data[index], 'folded', false)
    parent.data || this.$set(this.data[index], 'data', [])
    // default data
    const newItem: any = {}
    newItem[this.cfg.field] = ''
    newItem.data = []
    newItem.__disabled = true

    parent.data.push(newItem)
    function cb(err?: any) {
      if (err) {
        return parent.data.pop()
      }

      newItem.__disabled = false
      requestAnimationFrame(() => {
        const node = (event.target as any).parentNode.parentNode.nextElementSibling
        const inp = node.querySelector(':scope > ul > li:last-child').querySelector('input[type="text"]')
        inp && inp.focus()
      })
    }

    if (typeof this.cfg.onCreate === 'function') {
      return this.cfg.onCreate({ item: newItem, parent }, cb)
    }
    return cb()
  }

  protected onEdit(event: MouseEvent, index: number, item: any, element?: any) {
    const elem = element || event.target
    const parent = this.tree || this.cfg
    const cb = () => {
      this.editIndex = index
      requestAnimationFrame(() => {
        const inp = elem.parentNode.parentNode.querySelector('.fc-name > input[type="text"]')
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
  }

  protected onSubmit(event: KeyboardEvent, index: number, item: any) {
    const parent = this.tree || this.cfg
    const value = (event.target as any).value
    const oldVal = item[this.cfg.field]

    if (!value || value === oldVal) {
      oldVal || this.data.splice(index, 1)
      this.editIndex = false
      return
    }

    const cb = (err?: any) => {
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
  }

  protected onRemove(index: number, item?: any) {
    const cb = (err?: any) => (err ? false : this.data.splice(index, 1))
    if (typeof this.cfg.onRemove === 'function') {
      return this.cfg.onRemove({ item, parent: this.tree || this.cfg }, cb)
    }
    return cb()
  }
}
