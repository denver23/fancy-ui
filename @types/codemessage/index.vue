<template lang="pug">
  .fancy-codemessage(v-if="cfg.show")
    button(
      v-bind="{disabled: downtime > 0}"
      v-text="txt"
      @click="click"
      type="button"
    )
</template>

<script src="./script.ts"></script>

<style lang="sass">
  @import "~fancy_style"
  @import "~fancy_mixins"
  .fancy-codemessage
    button
      @include mixin-button()
      width: 100%
      padding: 0
      height: $form-height
      &:disabled
        background: $colorDisable
        color: $colorFont
</style>

