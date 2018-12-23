
<template lang="pug">
  .fancy-datetimepicker(:style="position" @click="onClose" v-show="cfg.visible")
    div(@click.stop="" @mousedown.stop="")
      .fc-tool(v-if="format !== 'time'")
        i.fc-l(@click="onYearChange(-1)")
        span(v-text="year")
        i.fc-r(@click="onYearChange(1)")
        cite(@click="goToday") {{cfg.today}}
        i.fc-l(@click="onMonthChange(-1)")
        span(v-text="month+1")
        i.fc-r(@click="onMonthChange(1)")

      .fc-table(v-if="format !== 'time'")
        ul
          li(v-for="week of cfg.weeks" class="fc-week")
            span {{week}}
        ul(v-for="value of days")
          li(
            v-for="v of value"
            v-bind:class="{'fc-active': v.year == year && v.month == month && v.day == day, 'fc-disabled': v.disabled, 'fc-prevnext': v.prevnext}"
            @click.stop="onChoose(v)"
          )
            span(v-text="v.day")
            //- Lunar
            //- em(v-if="showLunar"){{child.lunar}}
      template(v-if="format === 'datetime' || format === 'time'")
        .fc-time
          input(
            type="number"
            v-model="hour"
            min="0"
            max="23"
            maxlength="2"
            pattern="\d{1,2}"
            @keydown="onKeyDownInp"
          )
          | {{cfg.times[0]}}
          input(
            type="number"
            v-model="minute"
            min="0"
            max="59"
            maxlength="2"
            @keydown="onKeyDownInp"
          )
          | {{cfg.times[1]}}
          input(
            type="number"
            v-model="second"
            min="0"
            max="59"
            maxlength="2"
            @keydown="onKeyDownInp"
          )
          | {{cfg.times[2]}}
        .fc-bot
          span(@click="onSubmit") {{cfg.confirm}}
          span(@click="onClose") {{cfg.cancel}}
      div(ref="scrollview")
</template>

<script src="./script.ts"></script>

<style lang="sass">
  @import "~fancy_style"
  @import "~fancy_mixins"

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
