import { Component, Vue } from 'vue-property-decorator'

export interface IPagination {
  total?: number
  page?: number
  perpage?: number
  linknum?: number
  prevPage?: string
  nextPage?: string
  firstPage?: string
  lastPage?: string
  callback?: (page?: number) => void
}

const options: IPagination = {
  total: 0,
  page: 1,
  perpage: 10,
  linknum: 5,
  prevPage: '<',
  nextPage: '>',
  firstPage: '',
  lastPage: '',
}

@Component({
  props: ['cfg'],
})
export default class App extends Vue {
  private cfg: IPagination

  protected created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
  }

  private get maxPage() {
    return Math.ceil(this.cfg.total / this.cfg.perpage)
  }

  protected get forData() {
    const self = this
    const res = []
    const maxPage: number = this.maxPage
    const page: number = Math.min(self.cfg.page, maxPage)
    const step: number = Math.ceil(self.cfg.linknum / 2)

    if (self.cfg.linknum > 2) {
      let begin = 0
      let end = 0
      begin = page - step + 1
      end = page + step - 1

      if (end >= maxPage) {
        begin = maxPage - self.cfg.linknum + 1
        end = maxPage
      }
      if (begin <= 0) {
        begin = 1
        end = Math.min(self.cfg.linknum, maxPage)
      }
      for (let i = begin; i <= end; i++) {
        res.push({
          num: i,
          text: i,
        })
      }
    }
    res.unshift({
      num: page - 1,
      text: self.cfg.prevPage,
    })
    if (self.cfg.firstPage && page > step) {
      res.unshift({
        num: 1,
        text: self.cfg.firstPage,
      })
    }
    res.push({
      num: page + 1,
      text: self.cfg.nextPage,
    })
    return res
  }

  protected onClick(page?: number) {
    if (page < 1 || page > this.maxPage) {
      return
    }
    this.cfg.page = page
    typeof this.cfg.callback === 'function' && this.cfg.callback(page)
  }
}
