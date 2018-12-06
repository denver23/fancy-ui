<template lang="pug">
  .fancy-message(v-if="cfg.content && cfg.time != 0")
    .fc-status(:class="'fc-'+ cfg.status")
    .fc-content(:class="'fc-'+ cfg.status" v-html="cfg.content || cfg.status")
</template>

<script src="./script.ts"></script>

<style lang="sass">
  @import "~fancy_style"
  .fancy-message
    padding: $space * 4
    .fc-status
      height: $space * 24
      mask: url(images/checkmark-circled.svg) no-repeat center center
      mask-size: auto 100%
      background-color: $colorGreen
      &.fc-error
        mask-image: url(images/close-circled.svg)
        background-color: $colorRed
      &.fc-question
        mask-image: url(images/help-circled.svg)
        background-color: $colorAlerm
      &.fc-info,
      &.fc-alerm,
      &.fc-exclamation
        mask-image: url(images/android-alert.svg)
        background-color: $colorAlerm

    .fc-content
      margin: $space * 2 auto
      text-align: center
      color: $colorGreen
      font-size: 2rem
      &.fc-error
        color: $colorRed
      &.fc-question
        color: $colorAlerm
      &.fc-info,
      &.fc-alerm,
      &.fc-exclamation
        color: $colorAlerm
</style>
