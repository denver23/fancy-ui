import { Component, Watch, Vue } from 'vue-property-decorator'

// let str = '2012.12-23 23:01:59'
// let res = str.match(/^(\d{4,4})\D*(\d{1,2})\D+(\d{1,2})\D*(\d{1,2}):(\d{1,2}):(\d{1,2}).*/)
// function buildCalendar(year = new Date().getFullYear(), month = new Date().getMonth(), validBegin = '', validEnd) {

function buildCalendar(y: string, m: string, validBegin: string = '', validEnd: string) {
  const year = parseInt(y, 10)
  const month = parseInt(m, 10)

  const firstWeekOfMonth = new Date(year, month, 1).getDay()
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate()
  const lastDayOfLastMonth = new Date(year, month, 0).getDate()

  let beginTime = Date.parse(validBegin) || 0
  let endTime = Date.parse(validEnd) || Date.parse('2100.12.30')
  let tmp = [beginTime, endTime].sort()
  beginTime = tmp[0]
  endTime = tmp[1]
  tmp = null

  let row = 0
  const res = []

  for (let i = 1; i <= lastDayOfMonth; i++) {
    const date = new Date(year, month, i)
    const time = Date.parse(String(date))

    let week = date.getDay()
    let disabled = false

    if (beginTime > 0) {
      disabled = beginTime > time
    }
    if (!disabled && endTime > 0) {
      disabled = endTime < time
    }
    // first week
    if (week === 0) {
      res[row] = []
    } else if (i === 1) {
      res[row] = []
      // last month
      let k = lastDayOfLastMonth - firstWeekOfMonth + 1
      for (let j = 0; j < firstWeekOfMonth; j++) {
        res[row].push({
          year: month > 0 ? year : year - 1,
          month: month > 0 ? month - 1 : 11,
          day: k,
          prevnext: true,
          disabled,
        })
        k++
      }
    }
    // current month
    res[row].push({
      year,
      month,
      day: i,
      prevnext: false,
      disabled,
    })
    // last week
    if (week === 6) {
      row++
    } else if (i === lastDayOfMonth) {
      // next month
      let k = 1
      for (week; week < 6; week++) {
        res[row].push({
          year: month >= 11 ? year + 1 : year,
          month: month >= 11 ? 0 : month + 1,
          day: k,
          prevnext: true,
          disabled,
        })
        k++
      }
    }
  }
  return res
}

export interface IDatetimePicker {
  target: string
  value: number
  type: string
  beginDate?: string
  endDate?: string
  minYear?: number
  maxYear?: number
  today?: string
  weeks?: string[]
  times?: string[]
  confirm?: string
  cancel?: string
  onSelect?: (str: string) => void
}

const minYear = 1970
const maxYear = 2100
const options: IDatetimePicker = {
  target: '',
  value: Date.now(),
  type: 'date',
  beginDate: '',
  endDate: '',
  minYear,
  maxYear,
  today: 'Today',
  weeks: ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'],
  times: ['h', 'm', 's'],
  confirm: 'Confirm',
  cancel: 'Cancel',
  onSelect: str => console.log(str),
}

@Component({
  props: ['cfg'],
})
export default class App extends Vue {
  private cfg: IDatetimePicker
  private year: number = 0
  private month: number = 0
  private day: number = 0
  private hour: number = 0
  private minute: number = 0
  private second: number = 0
  private type: string = '' // date|datetime
  protected position: any = false

  protected created() {
    Object.keys(options).forEach(i => {
      this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, (options as any)[i])
    })
    this.type = this.cfg.type || (String(this.cfg.value).indexOf(':') > 0 ? 'datetime' : 'date')
    this.getTime(cfg.value)
  }

  protected mounted() {
    requestAnimationFrame(() => {
      document.addEventListener('click', this.onClose, false)
      document.addEventListener('keydown', this.onKeyDown, false)
      this.getPosition()
    })
  }
  protected destroyed() {
    document.removeEventListener('click', this.onClose, false)
    document.removeEventListener('keydown', this.onKeyDown, false)
  }

  protected get days() {
    return buildCalendar(String(this.year), String(this.month), this.cfg.beginDate, this.cfg.endDate)
  }

  @Watch('year')
  protected onYearChanged(val: number) {
    // last day of month
    const lastday = new Date(val, this.month + 1, 0).getDate()
    this.day = Math.min(this.day, lastday)
  }

  @Watch('month')
  protected onMonthChanged(val: number) {
    // last day of month
    const lastday = new Date(this.year, val + 1, 0).getDate()
    this.day = Math.min(this.day, lastday)
  }

  protected getPosition() {
    if (!this.cfg.target) {
      return false
    }
    const elem = document.querySelector(this.cfg.target)
    const rect = elem ? elem.getBoundingClientRect() : false
    if (rect) {
      this.position = {
        top: (window.scrollY || window.pageYOffset) + rect.bottom + 'px',
        left: (window.scrollX || window.pageXOffset) + rect.left + 'px',
      }
    } else {
      this.position = false
    }
  }
  protected getTime(value: string) {
    const date = Date.parse(value) ? new Date(Date.parse(value)) : new Date()
    this.year = date.getFullYear()
    this.month = date.getMonth()
    this.day = date.getDate()
    this.hour = date.getHours()
    this.minute = date.getMinutes()
    this.second = date.getSeconds()
  }

  protected onClose(e) {
    e && e.stopPropagation && e.stopPropagation()
    this.cfg.__name && (this.$parent[this.cfg.__name] = false)
  }
  protected onKeyDown(e) {
    if ([8, 27, 13, 32, 37, 38, 39, 40].includes(e.keyCode)) {
      e.preventDefault()
      e.stopPropagation()
    }
    // back Esc
    if ([8, 27].includes(e.keyCode)) return this.onClose()
    // enter space
    if ([13, 32].includes(e.keyCode)) return this.onSubmit()
    // up down
    if (e.keyCode == 38) this.onDayChange(-7)
    if (e.keyCode == 40) this.onDayChange(7)
    // left right
    if (e.keyCode == 37) this.onDayChange(-1)
    if (e.keyCode == 39) this.onDayChange(1)
  }
  protected onKeyDownInp(e) {
    e.stopPropagation()
    // return enter
    if (e.keyCode == 13) return this.onSubmit()
  }
  protected goToday() {
    let t = new Date()
    this.year = t.getFullYear()
    this.month = t.getMonth()
    this.day = t.getDate()
  }
  protected onYearChange(n) {
    this.year = Math.min(Math.max(this.year + n, this.cfg.minYear || minYear), this.cfg.maxYear || maxYear)
  }
  protected onMonthChange(n) {
    let newmonth = this.month + n
    if (newmonth > 11) {
      if (this.year >= this.cfg.maxYear) return
      this.year++
      this.month = 0
      return
    }
    if (newmonth < 0) {
      if (this.year <= this.cfg.minYear) return
      this.year--
      this.month = 11
      return
    }
    this.month = newmonth
  }
  protected onDayChange(n) {
    // last day of last month
    let prelastday = new Date(this.year, this.month, 0).getDate()
    // last day of month
    let lastday = new Date(this.year, this.month + 1, 0).getDate()
    let newday = this.day + n

    if (newday > lastday) {
      if (this.month == 11) {
        if (this.year >= this.cfg.maxYear) return
        this.year++
        this.month = 0
      } else {
        this.month++
      }
      this.day = newday - lastday
      return
    }
    if (newday < 1) {
      if (this.month == 0) {
        if (this.year <= this.cfg.minYear) return
        this.year--
        this.month = 11
      } else {
        this.month--
      }
      this.day = prelastday + newday
      return
    }
    this.day = newday
    // this.day = Math.min( Math.max(this.day + n, 1), lastday )
  }
  protected onChoose(item) {
    this.year = item.year
    this.month = item.month
    this.day = item.day
    this.onSubmit()
  }
  protected onSubmit() {
    let res = new Date(
      [this.year, this.month + 1, this.day].join('/') + ' ' + [this.hour, this.minute, this.second].join(':'),
    )
    if (!isNaN(res)) {
      this.onClose()
      this.cfg.onSelect(res)
    }
  }
}
