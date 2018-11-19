<template lang="pug">
  .fancy-searchview
    input(
      ref="inp"
      type="text"
      v-bind="[cfg.attr]"
      v-model="cfg.value"
      @focus="onFocus($event)"
      @blur="onBlur()"
      @keyup="onKeyUp($event)"
      @keydown="onKeyDown($event)"
      autocomplete="off"
    )
    template(v-if="show")
      ul(ref="list" v-if="cfg.data && cfg.data.length > 0")
        li(
          v-for="(v,index) of cfg.data",
          :class="{'fc-active': index == selectIndex}"
          @click="onChoose(v)"
        )
          span(v-html="$options.filters.highlight(v.name, cfg.value)")
      div(v-else v-text="cfg.empty")
</template>

<script src="./script.ts"></script>

<style lang="sass">
  @import "~fancy_style"
  $size: 20rem
  .fancy-searchview
    position: relative
    z-index: 900
    input
      display: inline-block
      height: $form-height
      padding: 0 $space
      margin-right: $space
      min-width: $size
      color: $colorFont
      border: 1px solid $borderColor
      -webkit-appearance: none
      border-radius: 0
      &:focus
        border: 1px solid $colorAlerm
        outline: none
    > div,
    > ul
      position: absolute
      left: 0
      top: $form-height
      min-width: $size
      max-height: $size
      overflow-y: auto
      border: 1px solid $borderColor
      background: #fff
      margin-top: 1px
      &:empty
        display: none
    li
      cursor: pointer
      display: block
      overflow: hidden
      height: $row-height
      line-height: $row-height
      border-bottom: 1px dashed $borderColor
      padding: 0 $space
      display: flex
      flex-wrap：nowrap
      &:last-child
        border: none
      &:hover
        background: rgba($colorTheme, 0.3)
      &.fc-active
        background: $colorTheme
        color: #fff
      span
        display: block
        white-space: nowrap
        text-overflow: ellipsis
        overflow: hidden
        flex: 1 1 0
      em
        color: $colorAlerm
        font-style: normal
    div
      color: $colorDisable
      width: $size
      line-height: $row-height
      padding-left: $space

    @media #{$device-mobile}
      ul,div
        width: 100%
</style>
