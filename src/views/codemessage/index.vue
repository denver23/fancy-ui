<style lang="sass">
  @import "../../config.sass"
  .test-codemessage
    margin: 50px 10px
    text-align: center
    button
      line-height: $row-height

</style>

<template lang="pug">
  .test-codemessage
    component(is="codemessage", :cfg="codemessage" v-if="codemessage")
</template>

<script>
  import codemessage from 'fancy/codemessage/';

  export default {
    components: {
      codemessage
    },
    data() {
      return {
        codemessage: false
      }
    },
    mounted() {
      this.codemessage = {
        show: true,
        text: 'Send',
        repeat: 'Resend code',
        duration: 60,   // second
        history: 0,     // second
        auto: false,
        onSubmit() {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve()
            }, 800)
          })
        },
      }
    },
    methods: {
    }
  };
</script>
