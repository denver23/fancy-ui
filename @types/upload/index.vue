<template lang="pug">
  .fancy-upload(:class="'fc-'+ cfg.dock" v-show="cfg.data.length || cfg.button")
    ul(ref="workbench")
      li(:class="'fc-'+ v.type" v-for="(v,key) in cfg.data" v-bind:index="key + 1")
        div(@click="onChoose(v)")
          img(:src="v.src || v.url" v-if="v.src || v.url")
          .fc-progress(v-if="v.progress && v.progress < 100" v-bind:data="v.progress + '%'")
            .fc-bar

        canvas(:style="cfg.size" v-if="v.base64")
        //- .fc-2
        //-     //- label.fa.fa-rotate-left(@click="turn($index,1)")
        //-     //- label.fa.fa-rotate-right(@click="turn($index,2)")
        //-     cite.fa.fa-close(@click="del($index)")
      li(v-show="cfg.button")
        input(ref="file" type="file" @change="onChange" multiple="multiple")
</template>

<script src="./script.ts"></script>

<style lang="sass">
  @import "~fancy_style"
  .fancy-upload
    $size: 6rem
    &.fc-right
      position: fixed
      z-index: $zIndex - 1
      top: 0
      bottom: 0
      right: 0
      overflow-y: auto
      overflow-x: hidden

      padding: $space
      width: $size + $space * 2
      box-sizing: border-box
      opacity: 0.4
      background: #fff
      border-left: 1px solid $borderColor
      &:hover
        opacity: 1
    canvas
      visibility: hidden
    ul,
    li
      padding: 0
      margin: 0
      list-style: none
    li
      position: relative
      display: inline-block
      margin: $space / 2
      width: $size
      height: $size
      overflow: hidden
      border: 1px solid rgba($borderColor, 0.8)
      border-radius: $borderRadius
      cursor: pointer
      box-sizing: border-box
      &:hover
        border-color: $colorTheme
      &:not(:last-child)
        &::after
          content: attr(index)
          position: absolute
          top: 0
          right: 0
          width: 1.6em
          height: 1.6em
          border-radius: 100%
          background: rgba(#000, 0.5)
          color: #fff
          display: flex
          justify-content: center
          align-items: center
      // add button
      &:last-child
        background: #fff
        input
          display: block
          position: absolute
          opacity: 0
          top: 0
          left: 0
          bottom: 0
          right: 0
          z-index: 10
          cursor: pointer
          min-width: auto
          height: auto
          margin: 0
          padding: 0
        &:hover
          &::before,
          &::after
            border-color: $colorTheme
        &::before,
        &::after
          content: ""
          position: absolute
          top: 50%
          left: 50%
          opacity: 0.5
        &::before
          width: 40%
          border-top: 3px solid $borderColor
          transform: translate3d(-50%,-1px,0)
        &::after
          height: 40%
          border-left: 3px solid $borderColor
          transform: translate3d(-1px,-50%,0)
      > div
        height: $size
        img
          position: absolute
          width: 100%
          top: 50%
          transform: translate3d(0, -50%, 0)

        .fc-progress
          position: absolute
          top: 50%
          left: 0
          right: 0
          margin: 0 $space
          transform: translate3d(0, -40%, 0)
          text-align: center
          &::before
            content: ""
            position: absolute
            left: 0
            right: 0
            z-index: -1
            background: #fff
            height: $space
            border-radius: $space
          &::after
            content: attr(data)
            color: #fff
          .fc-bar
            height: $space
            background: red
            border-radius: $space
            margin-bottom: $space / 2

    @media #{$device-mobile}
      li:last-child
        input
          position: absolute
          top: 0
          left: 0
          bottom: 0
          right: 0
          height: auto
</style>
