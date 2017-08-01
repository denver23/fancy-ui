<style lang="sass">
  @import "../../config.sass"
  .test-confirm
    margin: 50px auto
    text-align: center
    > button
      padding: 10px 30px
      border: 1px solid #ccc

    > .result
      margin: 30px auto

</style>

<template lang="jade">
  .test-confirm
    component(is="confirm", :cfg="confirm" v-if="confirm")
    button(@click="test") confirm
</template>

<script>
  import confirm from 'fancy/confirm/';

  export default {
    components: {
      confirm
    },
    data() {
      return {
        confirm: false,
      }
    },
    methods: {
      test() {
        this.confirm = {
          message: 'say something',
          confirm: 'confirm',
          cancel: 'cancel',
          onConfirm() {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 2000)
            })
          },
          onCancel() {
            console.log('cancel')
          },
        }
      }
    }
  };
</script>
