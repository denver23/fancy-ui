import { Component, Prop, Vue } from 'vue-property-decorator'

interface ITablesColumns {
  label?: string
  field: string
  style?: any
  callback?: (v: any) => string
}

export const enum ETableState {
  loading = 'loading',
}

export interface ITables {
  data?: any
  state?: ETableState | string
  columns?: ITablesColumns[]
  columnFilter?: Array<number|string>
  onCreated?: () => void
}

const options: ITables = {
  data: '',
  columns: [],
  columnFilter: [],
  state: ETableState.loading,
}

@Component
export default class ComponentTables extends Vue {
  @Prop() protected cfg: ITables

  protected created() {
    const cfg = this.cfg
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
    cfg.onCreated && cfg.onCreated.call(this)
  }
}
