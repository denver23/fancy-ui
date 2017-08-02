<style lang="sass">
  @import "../../config.sass"
  .test-datetimepicker
    margin: 50px auto
    text-align: center
    > button
      padding: 10px 30px
      border: 1px solid #ccc

</style>

<template lang="jade">
  .test-datetimepicker
    component(is="datetimepicker", :cfg="datetimepicker" v-if="datetimepicker")
    button.btn(@click="test") datetimepicker
    br
    span {{datetime}}
</template>

<script>
  import datetimepicker from 'fancy/datetimepicker/';

  export default {
    components: {
      datetimepicker
    },
    data() {
      return {
        datetime: Date.now(),
        datetimepicker: false,
      }
    },
    methods: {
      test() {
        this.datetimepicker = {
          target: '.btn',
          value: this.datetime,
          beginDate: '',
          endDate: '',
          minYear: 1970,
          maxYear: 2100,
          today: 'Today',
          weeks: ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'],
          times: ['h', 'm', 's'],
          confirm: 'Confirm',
          cancel: 'Cancel',
          onSelect: str => {
            this.datetime = str;
          }
        }
      }
    }
  };
</script>
