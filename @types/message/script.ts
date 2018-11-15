import { Component, Vue } from 'vue-property-decorator'

export const enum EFancyMessageStatus {
  error = 'error',
  success = 'success',
  question = 'question',
  info = 'info',
  alert = 'alert',
}

/**
 * @param status error | success | question | info | alert
 * @param content
 * @param url: back | url
 * @param time {-1} millisecond < 0: no jump
 */
export interface IFancyMessage {
  status?: EFancyMessageStatus
  content?: string
  url?: string
  time?: number
}

// error | success | question | info | alert
const options: IFancyMessage = {
  status: EFancyMessageStatus.success,
  content: '',
  url: 'back',
  time: -1, // millisecond <0: no jump
}

@Component({
  props: ['cfg'],
})
export default class App extends Vue {
  private cfg: any

  protected created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
  }

  protected mounted() {
    this.jump(this.cfg.time, this.cfg.url)
  }

  private jump(time: number, url: string | (() => void)) {
    const t = Math.trunc(time)
    if (t >= 0 && url) {
      setTimeout(() => {
        if (typeof url === 'function') {
          return url()
        }
        if (url === 'back') {
          return window.history.back()
        }
        url === 'close' ? window.close() : (window.location.href = url)
      }, t)
    }
  }
}
