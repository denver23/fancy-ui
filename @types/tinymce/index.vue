<template lang="pug">
  .fancy-tinymce
    textarea(:name="cfg.name" ref="textarea") {{cfg.value}}
</template>

<script src="./script.ts"></script>

<style lang="sass">
  @import "~fancy_style"
  .fancy-tinymce
    textarea
      width: 10rem
    .mce-fullscreen
      z-index: $zIndex - 10
</style>
