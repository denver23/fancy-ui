import { Component, Watch, Vue } from 'vue-property-decorator'

function getQueryAll() {
  const res: any = {}
  const str = window.location.search.substr(1)
  const reg = /([^=&]+)=([^&]*)/g
  if (str) {
    str.replace(reg, (all: any, key: string, value: string | number) => {
      res[key] = decodeURIComponent(String(value))
      return ''
    })
  }
  return res
}

export interface IForms {
  data: any[]
  type: string
  value: any
  pushstate?: any
  validator?: any
  onReset?: () => void
  onReady?: (data: any, form: HTMLFormElement) => void
  onSubmit?: (data: any, form: HTMLFormElement) => void
  onPopstate?: (data: any, form: HTMLFormElement) => void
}

const options: IForms = {
  data: null,
  type: '', // search column forms
  value: {},
  pushstate: false, // object
  validator: false,
}

@Component({
  props: ['cfg'],
})
export default class App extends Vue {
  private cfg: IForms
  protected tips: any = {}
  protected sending: boolean = false
  protected submitName: string = 'onSubmit_'
  protected checkAll: any = {}
  private timer: any = {}

  protected created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })

    const cfg = this.cfg
    if (cfg.type === 'search') {
      Object.assign(cfg.value, getQueryAll())
      typeof cfg.onPopstate === 'function' &&
        window.addEventListener('popstate', () => {
          Object.assign(cfg.value, getQueryAll())
          cfg.onPopstate(cfg.value, (this.$refs as any).form)
        })
    }
    // validator and submit
    if (cfg.data) {
      cfg.data.forEach(val =>
        (Array.isArray(val) ? val : [val]).forEach(v => {
          if (v.type === 'submit') {
            this.submitName = v.name || 'onSubmit_'
            this.$set(this.tips, this.submitName, '')
            this.$set(v, 'name', this.submitName)
          } else if (v.name && !['reset', 'button', 'component'].includes(v.type)) {
            this.$set(this.tips, v.name, '')
            this.$set(cfg.value, v.name, v.name in cfg.value ? cfg.value[v.name] : v.value || '')
            // set checkAll
            if (v.type === 'checkbox' && v.checkAll) {
              let chked = true
              for (const chk of v.data) {
                if (!cfg.value[v.name].includes(chk.value)) {
                  chked = false
                  break
                }
              }
              this.checkAll[v.name] = chked
            }
          }
        }),
      )
    }
  }
  protected mounted() {
    requestAnimationFrame(() => {
      const cfg = this.cfg
      if (typeof cfg.onReady === 'function') {
        cfg.onReady.call(this, cfg.value, this.$refs.form)
      }
      if (typeof cfg.onReset === 'function') {
        const inp = this.$el.querySelector('input[type="reset"]')
        inp && inp.addEventListener('click', cfg.onReset.bind(this))
      }
    })
  }

  @Watch('cfg.pushstate')
  protected onPushStateChanged(val: any) {
    if (typeof val === 'object') {
      const url = window.location.href.split('?')[0]
      const param = Object.entries(val)
        .map(v => v[1] && v.join('='))
        .filter(v => v)
        .join('&')
      window.history.pushState({ title: '' }, '', `${url}?${param}`)
    }
  }

  protected onChkAll(v: any) {
    const arr = this.cfg.value[v.name]
    arr.splice(0)
    if (this.checkAll[v.name]) {
      v.data.forEach((vv: any) => arr.push(vv.value))
      if (typeof v.checkAll.value !== 'undefined') {
        arr.push(v.checkAll.value)
      }
    }
  }
  protected onChk(v: any, vv: any) {
    if (v.checkAll) {
      const val = this.cfg.value[v.name]
      if (val && val.includes(vv.value)) {
        if (val.length === v.data.length) {
          this.checkAll[v.name] = v.checkAll.value || true
          if (typeof v.checkAll.value !== 'undefined') {
            val.push(v.checkAll.value)
          }
        }
      } else {
        this.checkAll[v.name] = false
        const index = val.findIndex((n: string | number) => n === v.checkAll.value)
        if (index >= 0) {
          val.splice(index, 1)
        }
      }
    }
  }

  protected async onSubmit() {
    const cfg = this.cfg
    if (cfg.validator) {
      for (const [key, func] of Object.entries(cfg.validator) as [string, any]) {
        const res: boolean = func(cfg.value[key], cfg.value)
        if (res !== true) {
          this.tips[key] = false

          const input: HTMLInputElement = this.$el.querySelector(`[name="${key}"]`)
          input.focus()

          requestAnimationFrame(() => {
            this.tips[key] = res
            clearTimeout(this.timer[key])
            this.timer[key] = setTimeout(() => {
              this.tips[key] = false
            }, 3000)
          })
          return
        }
      }
    }

    this.tips[this.submitName] = ''
    if (this.sending) {
      return
    }
    this.sending = true
    try {
      cfg.onSubmit && (await cfg.onSubmit.call(this, cfg.value, this.$refs.form))
    } catch (err) {
      this.tips[this.submitName] = err
    }
    this.sending = false
  }
}
