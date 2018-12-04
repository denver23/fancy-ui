import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

interface ITablesPicker {
  name: string
  value: any[]
  filter: any[]
}

export interface ITables {
  data?: any
  columns?: any[]
  values?: any
  state?: string
  picker?: ITablesPicker
  onCreated?: () => void
}

const options: ITables = {
  data: '',
  columns: [],
  values: {},
  state: 'loading',
  picker: {
    name: '',
    value: [],
    filter: [],
  },
}

@Component
export default class ComponentTables extends Vue {
  @Prop() protected cfg: ITables

  protected modelAll: any = {}
  protected pickerState: boolean = false

  protected created() {
    const cfg = this.cfg
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })

    cfg.columns &&
      cfg.columns.forEach((v, k) => {
        v.label === 'checkbox' && this.$set(this.modelAll, v.field, false)
      })
    cfg.onCreated && cfg.onCreated.call(this)
  }

  protected mounted() {
    document.addEventListener('click', this.onPicker, false)
  }

  protected destroyed() {
    document.removeEventListener('click', this.onPicker, false)
  }

  @Watch('cfg.data')
  protected onDataChanged() {
    for (const i of Object.keys(this.modelAll)) {
      this.modelAll[i] = false
      this.cfg.values[i] = []
    }
  }

  protected onPicker() {
    this.pickerState = false
  }
  protected onChkAll(column: any) {
    const key = column.field
    const arr = this.cfg.values[key] || []
    arr.splice(0)
    this.modelAll[key] && this.cfg.data.forEach((v: any) => arr.push(v[key]))
  }

  protected onChk(key: string, item?: any) {
    this.modelAll[key] =
      this.cfg.values[key] &&
      this.cfg.values[key].includes(item[key]) &&
      this.cfg.values[key].length === this.cfg.data.length
  }
}
