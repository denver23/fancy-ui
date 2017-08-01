<style lang="sass">
  @import "../../config.sass"
  .test-alert
    margin: 50px auto
    text-align: center
    > button
      padding: 10px 30px
      border: 1px solid #ccc

</style>

<template lang="jade">
  .test-alert
    component(is="alert", :cfg="alert" v-if="alert")
    button(@click="test") Alert
</template>

<script>
  import alert from 'fancy/alert/';

  export default {
    components: {
      alert
    },
    data() {
      return {
        alert: false,
      }
    },
    methods: {
      test() {
        this.alert = {
          message: 'say<br>something',
        }
      }
    }
  };
</script>
