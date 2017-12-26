<style lang="sass">
  @import "../../config.sass"
  .test-citypicker
    margin: 50px auto
    text-align: center
    > button
      padding: 10px 30px
      border: 1px solid #ccc

    > .result
      margin: 30px auto

</style>

<template lang="pug">
  .test-citypicker
    component(is="citypicker", :cfg="citypicker" v-if="citypicker")
    button(@click="test") citypicker
    .result {{result}}
</template>

<script>
  import citypicker from 'fancy/citypicker/';

  export default {
    components: {
      citypicker
    },
    data() {
      return {
        cityid: '',
        citypicker: false,
        result: '',
      }
    },
    methods: {
      test() {
        let self = this;
        this.citypicker = {
          maxLevel: 3,
          value: this.cityid,
          onSelect(cityid, cityname, path) {
            self.cityid = cityid;
            self.result = JSON.stringify({
              cityid,
              cityname,
              path
            })
          }
        }
      }
    }
  };
</script>
