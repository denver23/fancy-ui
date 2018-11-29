import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

export interface ITreeDragDrop {
  data: any
  field: string
  maxLevel: number
  editBtn: boolean
  insertBtn: boolean
  removeBtn: boolean
  placeholder: string
  onClick?: (item: any, parent: any) => boolean
  onEdit?: (item: any, parent: any, isCreate: boolean) => boolean
  onCreate?: (item: any, parent: any, isCreate: boolean) => boolean
  onSubmit?: (valud: any, item: any, parent: any) => void
  onRemove?: (item: any, parent: any) => void
}

const options: ITreeDragDrop = {
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
function generateid(n?: number) {
  const a = []
  a[n || 8] = ''
  return a.join('x').replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

let dnding: boolean = false
const dnd: any = {
  rid: `fancy-tree-${generateid()}`,
  path: '',
  source: null,
  target: null,
  sourceTree: null,
  targetTree: null,
  prev: false,
  next: false,
}
@Component
export default class App extends Vue {
  @Prop() private cfg: ITreeDragDrop
  private tree: any
  private treelevel: number | undefined
  private treeMaxLevel: number
  private treePath: string

  private data: any = ''
  protected maxLevel: number = 0
  protected editIndex: number | boolean = false
  protected dnd: any = dnd
  protected ttree: any = null

  protected created() {
    typeof this.treelevel === 'undefined' &&
      Object.keys(options).forEach(i => {
        this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
      })

    this.data = (this.tree && this.tree.data) || this.cfg.data
    this.maxLevel = this.treeMaxLevel || this.cfg.maxLevel
    this.ttree = this
  }

  @Watch('data')
  protected onDataChanged(val: any) {
    val &&
      val.forEach((v: any, i: number) => {
        this.$set(v, 'open', typeof v.open === 'undefined' ? true : v.open)
        this.$set(v, '__path', (this.treePath || 'path') + '_' + i)
      })
  }
  protected onToggle(item: any) {
    item.open = !item.open
  }

  protected onToggleName(event: MouseEvent, index: number, item: any) {
    const elem = (event.target as any).parentNode.parentNode
    const res = this.cfg.onClick(item, this.tree || this.cfg)
    res ? this.onEdit(event, index, item, elem) : this.onToggle(item)
  }

  protected onAdd(event: MouseEvent, index: number, parent: any) {
    // parent open
    this.$set(this.data[index], 'open', true)
    parent.data || this.$set(this.data[index], 'data', [])

    // default data
    const newItem: any = {}
    newItem[this.cfg.field] = ''
    newItem.__disabled = true
    newItem.data = []

    parent.data.push(newItem)
    const ispure = this.cfg.onCreate(newItem, parent, true)
    if (ispure) {
      newItem.__disabled = false
      requestAnimationFrame(() => {
        const inp = (event.target as any).parentNode.parentNode.nextElementSibling
          .querySelector(':scope > ul > li:last-child')
          .querySelector('input[type="text"]')
        inp && inp.focus()
      })
    }
  }

  protected onEdit(event: MouseEvent, index: number, item: any, element: any) {
    const elem = element || event.target
    const parent = this.tree || this.cfg
    const ispure = this.cfg.onEdit(item, parent, false)
    if (ispure) {
      this.editIndex = index
      requestAnimationFrame(() => {
        const inp = elem.parentNode.parentNode.querySelector('.fc-name > input[type="text"]')
        if (inp) {
          inp.value = inp.value
          inp.focus()
        }
      })
    }
  }

  protected async onSubmit(event: KeyboardEvent, index: number, item: any) {
    const parent = this.tree || this.cfg
    const newVal = (event.target as any).value
    const oldVal = item[this.cfg.field]

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
  }

  protected async onRemove(index: number, item: any) {
    try {
      await this.cfg.onRemove(item, this.tree || this.cfg)
      this.data.splice(index, 1)
    } catch (e) {
      console.log(e)
    }
  }

  protected onDragStart(event: MouseEvent, item: any, instance: any) {
    event.stopPropagation()
    if (dnding) {
      return
    }
    dnding = true
    dnd.source = item
    dnd.sourceTree = instance
  }
  protected onDragOver(event: MouseEvent, item: any) {
    event.preventDefault()
    event.stopPropagation()
    if (item.__path.includes(dnd.source.__path)) {
      dnd.prev = false
      dnd.next = false
      return
    }
    const target: any = (event.target as any).closest('li')
    if (!target || target.getAttribute('fancy-tree-id') !== dnd.rid) {
      return
    }

    const x = event.pageX - window.scrollX
    const y = event.pageY - window.scrollY
    // div
    const h3 = 10
    const rect = target.childNodes[0].getBoundingClientRect()
    const topRect = {
      x1: rect.left,
      y1: rect.top,
      x2: rect.right,
      y2: rect.top + h3,
    }
    const bottomRect = {
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
  }

  protected onDragEnter(event: MouseEvent, item: any, instance: any) {
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
  }
  protected onDragEnd(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (!dnd.target || dnd.target.__path.includes(dnd.source.__path)) {
      return this.onClear()
    }
    if (dnd.prev || dnd.next) {
      return this.onDragMove(dnd.prev ? 'toPrev' : 'toNext')
    }
    this.onDragMove()
  }
  protected onDragMove(where?: string) {
    const el = this.$el
    const source = dnd.source
    const target = dnd.target
    const sourceData: any[] = dnd.sourceTree.data
    const targetData: any[] = dnd.targetTree.data

    if (!source || !target) {
      return this.onClear()
    }

    // prev or next
    if (where) {
      if (dnd.targetTree === dnd.sourceTree) {
        // same origin
        // insert
        let to = targetData.findIndex((v: any) => v === dnd.target)
        if (where === 'toNext') {
          to++
        }
        targetData.splice(to, 0, source)
        // delete
        const from = sourceData.findIndex((v: any, index: number) => v === dnd.source && index !== to)
        sourceData.splice(from, 1)
      } else {
        // different origin
        let to = targetData.findIndex(v => v === dnd.target)
        const from = sourceData.findIndex(v => v === dnd.source)
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
        this.onClear()
      })
      return
    }

    // delete
    sourceData.splice(sourceData.findIndex(v => v === source), 1)

    const targetChild = target.data || []
    targetChild.push(source)

    dnd.sourceTree.data = []
    target.data = []
    requestAnimationFrame(() => {
      dnd.sourceTree.data = sourceData
      this.$set(target, 'data', targetChild)
      target.open = true

      this.onClear()
      return
    })
  }
  protected onClear() {
    dnd.path = ''
    dnd.source = null
    dnd.target = null
    dnd.sourceTree = null
    dnd.targetTree = null
    dnd.prev = false
    dnd.next = false
    dnding = false
  }
}
