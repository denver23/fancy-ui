<style lang="sass">
  @import "~fancy_style"

  .fancy-datetimepicker
    $arrow: 1.6rem
    position: absolute
    z-index: 1000
    left: 0
    top: 0
    outline: none
    padding: $space 0 0
    box-sizing: border-box
    background: #fff
    border: 1px solid $borderColor
    border-bottom: none
    transform: translate3d(0, $arrow / 2, 0)
    // transition: opacity .5s ease,transform .5s ease
    // &.fc-fade-enter,
    // &.fc-fade-leave
    //   opacity: 0
    //   transform: translate3d(0,-20px, 0)
    &::before
      content: ""
      border: $borderColor solid
      border-width: 0 0 1px 1px
      width: $arrow
      height: $arrow
      position: absolute
      z-index: -1
      left: 2rem
      top: -1px
      background: #fff
      transform: translate3d(0,-50%,0) rotate(135deg)
    input
      width: auto
      min-width: 0
      margin: 0

    .fc-tool
      height: $row-height
      display: flex
      justify-content: space-between
      align-items: center
      padding: 0 2px
      i
        display: block
        width: $row-height
        height: $row-height
        position: relative
        &::before
          content: ""
          border: $colorTheme solid
          border-width: 0 0 1px 1px
          width: $space
          height: $space
          position: absolute
          top: 50%
          left: 50%
          transform: translate3d(-50%, -50%, 0) rotate(45deg)
        &.fc-r
          &::before
            transform: translate3d(-50%, -50%, 0) rotate(-135deg)
        &:hover
          background: $borderColor
      span
        border: 1px solid rgba($borderColor, 0.8)
        text-align: center
        display: inline-block
        height: $row-height
        line-height: $row-height
        box-sizing: border-box
        min-width: 4rem
      cite
        font-style: normal
        text-align: center
        flex: 1

    .fc-table
      margin-top: $space
      border: solid $borderColor
      border-width: 0 0 1px 0
      ul
        margin: 0
        padding: 0
        display: flex
        align-items: center
        &:first-child
          background: rgba($colorDisable, 0.5)
      li
        margin: 0
        flex: 1
        list-style: none
        list-style-position: outside
        cursor: pointer
        border: solid $borderColor
        border-width: 1px 1px  0 0
        display: flex
        align-items: center
        text-align: center
        height: $row-height
        width: $row-height
        box-sizing: border-box
        > span
          flex: 1
          display: block

        &:last-child
          border-right: none
        &:hover
          color: #fff
          background: rgba($colorTheme, 0.5)
        &.fc-week
          pointer-events: none !important
          cursor: default !important
        &.fc-disabled
          color: #c0c0c0
          pointer-events:none !important
          cursor: default !important
        &.fc-prevnext
          color: #c0c0c0
        &.fc-sign
          background: $colorTheme
          color: #fff
          &.fc-disabled
            background: rgba($colorTheme,0.5)
        &.fc-active
          background: $colorTheme
          color: #fff
          &.fc-disabled
            background: rgba($colorTheme,0.5)

    .fc-time
      margin-top: $space
      text-align: center
      display: flex
      justify-content: space-between
      align-items: center
      padding: 0 $space
      input
        border-radius: 0
        height: $row-height
        text-align: center
        border: 1px solid $borderColor
        flex: 1
        margin: 0 $space
        -webkit-appearance: none
        &[type="number"]
          &::-webkit-inner-spin-button,
          &::-webkit-outer-spin-button
            -webkit-appearance: none
        &:focus
          border: 1px solid $colorAlerm

    .fc-bot
      text-align: center
      padding: $space
      border-bottom: 1px solid $borderColor
      display: flex
      span
        @include mixin-button()
        flex: 1
        margin: 0 $space / 2
        &:nth-child(2)
          background: #efefef
          color: #666

    @media #{$device-mobile}
      @include mixin-mask()
      top: 0!important
      left: 0!important
      min-width: 0
      border: none
      padding: 0
      transform: none
      &::before
        display: none
      > div
        position: absolute
        top: auto
        left: 0
        right: 0
        bottom: 0
        padding: $space 0 0
        background: #fff
        box-sizing: border-box
        overflow: hidden
        animation: fancy-datetimepicker 0.3s ease-in
        @keyframes fancy-datetimepicker
            0%
              transform: translate3d(0, 100%, 0)
            100%
              transform: translate3d(0, 0, 0)
</style>

<template lang="jade">
  .fancy-datetimepicker(:style="position" @click="_close")
    div(@click.stop="")
      .fc-tool(v-if="type !== 'time'")
        i.fc-l(@click="_yearChange(-1)")
        span(v-text="year")
        i.fc-r(@click="_yearChange(1)")
        cite(@click="_goToday") {{cfg.today}}
        i.fc-l(@click="_monthChange(-1)")
        span(v-text="month+1")
        i.fc-r(@click="_monthChange(1)")
      .fc-table(v-if="type !== 'time'")
        ul
          li(v-for="week of cfg.weeks" class="fc-week")
            span {{week}}
        ul(v-for="value of days")
          li(
            v-for="v of value"
            v-bind:class="{'fc-active': v.year == year && v.month == month && v.day == day, 'fc-disabled': v.disabled, 'fc-prevnext': v.prevnext}"
            @click.stop="_choose(v)"
          )
            span(v-text="v.day")
            //- Lunar
            //- em(v-if="showLunar"){{child.lunar}}
      template(v-if="type === 'datetime' || type === 'time'")
        .fc-time
          input(
            :value="hour"
            type="number"
            v-model="hour"
            min="0"
            max="23"
            maxlength="2"
            pattern="\d{1,2}"
            @keydown="_kdownInp"
          )
          | {{cfg.times[0]}}
          input(
            :value="minute"
            type="number"
            v-model="minute"
            min="0"
            max="59"
            maxlength="2"
            @keydown="_kdownInp"
          )
          | {{cfg.times[1]}}
          input(
            :value="second"
            type="number"
            v-model="second"
            min="0"
            max="59"
            maxlength="2"
            @keydown="_kdownInp"
          )
          | {{cfg.times[2]}}
        .fc-bot
          span(@click="_submit") {{cfg.confirm}}
          span(@click="_close") {{cfg.cancel}}

</template>

<script>
  // let str = '2012.12-23 23:01:59';
  // let res = str.match(/^(\d{4,4})\D*(\d{1,2})\D+(\d{1,2})\D*(\d{1,2}):(\d{1,2}):(\d{1,2}).*/);
  function buildCalendar(year, month, validBegin = '', validEnd) {
    year = parseInt(year || new Date().getFullYear());
    month = parseInt(month || new Date().getMonth());

    let firstWeekOfMonth   = new Date(year, month, 1).getDay();
    let lastDayOfMonth     = new Date(year, month + 1, 0).getDate();
    let lastDayOfLastMonth = new Date(year, month, 0).getDate();

    let beginTime = Date.parse(validBegin) || 0;
    let endTime = Date.parse(validEnd) || Date.parse('2100.12.30');
    [beginTime, endTime] = [beginTime, endTime].sort();

    let row = 0;
    let res = [];

    for (let i = 1; i <= lastDayOfMonth; i++) {

      let date = new Date(year, month, i);
      let week = date.getDay();
      let time = Date.parse(date);
      let disabled = false;

      if (beginTime > 0) {
        disabled = beginTime > time;
      }
      if (!disabled && endTime > 0) {
        disabled = endTime < time;
      }

      // first week
      if (week == 0) {
        res[row] = [];
      } else if (i == 1) {
        res[row] = [];
        // last month
        let k = lastDayOfLastMonth - firstWeekOfMonth + 1;
        for (let j = 0; j < firstWeekOfMonth; j++) {
          res[row].push({
            year: month > 0 ? year : (year - 1),
            month: month > 0 ? (month - 1) : 11,
            day: k,
            prevnext: true,
            disabled: disabled,
          });
          k++;
        }
      }
      // current month
      res[row].push({
        year: year,
        month: month,
        day: i,
        prevnext: false,
        disabled: disabled,
      });
      // last week
      if (week == 6) {
        row++;
      } else if (i == lastDayOfMonth) {
        // next month
        let k = 1;
        for (week; week < 6; week++) {
          res[row].push({
            year: month >= 11 ? (year + 1) : year,
            month: month >= 11 ? 0 : (month + 1),
            day: k,
            prevnext: true,
            disabled: disabled,
          });
          k++;
        }
      }
    }
    return res;
  }

  const Options = {
    target: '',
    value: Date.now(),
    beginDate: '',
    endDate: '',
    minYear: 1970,
    maxYear: 2100,
    today: 'Today',
    weeks: ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'],
    times: ['h', 'm', 's'],
    confirm: 'Confirm',
    cancel: 'Cancel',
    onSelect: str => console.log(str),
    __name: 'datetimepicker',
  };

  export default {
    props: ['cfg'],
    data() {
      return {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        type: '', // date|datetime
        position: '',
      };
    },
    created() {
      Object.keys(Options).forEach(i => {
        (i in this.cfg) || this.$set(this.cfg, i, Options[i]);
      });
      this.type = this.cfg.type || (String(this.cfg.value).indexOf(":") > 0 ? 'datetime' : 'date');
      this._getTime(this.cfg.value);
    },
    mounted() {
      requestAnimationFrame(() => {
        document.addEventListener('click', this._close, false);
        document.addEventListener('keydown', this._kdown, false);
        this._getPosition()
      });
    },
    destroyed() {
      document.removeEventListener('click', this._close, false);
      document.removeEventListener('keydown', this._kdown, false);
    },
    computed: {
      days() {
        return buildCalendar(this.year, this.month, this.cfg.beginDate, this.cfg.endDate);
      },
    },
    watch: {
      year(v) {
        // last day of month
        let lastday = new Date(v, this.month + 1, 0).getDate();
        this.day = Math.min(this.day, lastday);
      },
      month(v) {
        // last day of month
        let lastday = new Date(this.year, v + 1, 0).getDate();
        this.day = Math.min(this.day, lastday);
      },
    },
    methods: {
      _getPosition() {
        if (!this.cfg.target) return false;
        let elem = document.querySelector(this.cfg.target);
        let rect = elem ? elem.getBoundingClientRect() : false;
        this.position = rect ? {
          top: (window.scrollY || window.pageYOffset) + rect.bottom + 'px',
          left: (window.scrollX || window.pageXOffset) + rect.left + 'px',
        } : false;
      },
      _getTime(value) {
        let date = Date.parse(value) ? new Date(Date.parse(value)) : new Date();
        this.year = date.getFullYear();
        this.month = date.getMonth();
        this.day = date.getDate();
        this.hour = date.getHours();
        this.minute = date.getMinutes();
        this.second = date.getSeconds();
      },
      _close(e) {
        e && e.stopPropagation && e.stopPropagation();
        this.cfg.__name && (this.$parent[this.cfg.__name] = false);
      },
      _kdown(e) {
        if ([8, 27, 13, 32, 37, 38, 39, 40].includes(e.keyCode)) {
          e.preventDefault();
          e.stopPropagation();
        }
        // back Esc
        if ([8, 27].includes(e.keyCode)) return this._close();
        // enter space
        if ([13, 32].includes(e.keyCode)) return this._submit();
        // up down
        if (e.keyCode == 38) this._dayChange(-7);
        if (e.keyCode == 40) this._dayChange(7);
        // left right
        if (e.keyCode == 37) this._dayChange(-1);
        if (e.keyCode == 39) this._dayChange(1);
      },
      _kdownInp(e){
        e.stopPropagation();
        // return enter
        if (e.keyCode == 13) return this._submit();
      },
      _goToday() {
        let t = new Date();
        this.year = t.getFullYear();
        this.month = t.getMonth();
        this.day = t.getDate();
      },
      _yearChange(n) {
        this.year = Math.min(Math.max(this.year + n, this.cfg.minYear), this.cfg.maxYear);
      },
      _monthChange(n) {
        let newmonth = this.month + n;
        if (newmonth > 11) {
          if (this.year >= this.cfg.maxYear) return;
          this.year++;
          this.month = 0;
          return;
        }
        if (newmonth < 0) {
          if (this.year <= this.cfg.minYear) return;
          this.year--;
          this.month = 11;
          return;
        }
        this.month = newmonth;
      },
      _dayChange(n) {
        // last day of last month
        let prelastday = new Date(this.year, this.month, 0).getDate();
        // last day of month
        let lastday = new Date(this.year, this.month + 1, 0).getDate();
        let newday = this.day + n;

        if (newday > lastday) {
          if (this.month == 11) {
            if (this.year >= this.cfg.maxYear) return;
            this.year++;
            this.month = 0;
          } else {
            this.month++;
          }
          this.day = newday - lastday;
          return;
        }
        if (newday < 1) {
          if (this.month == 0) {
            if (this.year <= this.cfg.minYear) return;
            this.year--;
            this.month = 11;
          } else {
            this.month--;
          }
          this.day = prelastday + newday;
          return;
        }
        this.day = newday;
        // this.day = Math.min( Math.max(this.day + n, 1), lastday );
      },
      _choose(item) {
        this.year = item.year;
        this.month = item.month;
        this.day = item.day;
        this._submit();
      },
      _submit() {
        let res = new Date([this.year, this.month + 1, this.day].join('/') + ' ' + [this.hour, this.minute, this.second].join(':'));
        if (!isNaN(res)){
          this._close();
          this.cfg.onSelect(res);
        }
      },
    }
  }
</script>

