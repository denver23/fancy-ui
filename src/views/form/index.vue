<style lang="sass">
  @import "../../config.sass"
  .test-form
    margin: 50px auto
</style>

<template lang="jade">
  .test-form
    component(is="form", :cfg="form" v-if="form")
</template>

<script>

  var formdata = [
    {
      name: 'level 1',
      data: [
        {name: 'level 1-1'},
        {
          name: 'level 1-2',
          data: [
            {name: 'level 1-2-1'},
            {name: 'level 1-2-2'},
            {name: 'level 1-2-3'},
            {name: 'level 1-2-4'},
            {name: 'level 1-2-5'},
          ]
        },
        {
          name: 'level 1-3',
          data: [
            {name: 'level 1-3-1'},
            {name: 'level 1-3-2'},
            {name: 'level 1-3-3'},
            {name: 'level 1-3-4'},
            {name: 'level 1-3-5'},
          ]
        },
        {name: 'level 1-4'},
        {name: 'level 1-5'},
      ]
    },
    {
      name: 'level 2',
      data: [
        {name: 'level 2-1'},
        {name: 'level 2-2'},
        {name: 'level 2-3'},
        {name: 'level 2-4'},
        {name: 'level 2-5'},
      ]
    }
  ]
  
  import form from 'fancy/form';
  export default {
    components: {
      form
    },
    data() {
      return {
        form: {
          data: formdata,
          field: 'name',
          maxLevel: 10,
          editBtn: true,
          insertBtn: true,
          removeBtn: true,
          placeholder: '',
          onClick: (item, parent) => true,
          onCreate: (item, parent, isCreate) => true,
          onEdit: (item, parent, isCreate) => true,
          onSubmit(value, item, parent) {
            return new Promise((resolve) => {
              setTimeout(() => resolve(), 100)
            });
          },
          onRemove(item, parent) {
            return new Promise((resolve) => {
              setTimeout(() => resolve(), 100)
            });
          },
        }
      }
    },
    mounted() {
    },
  };
</script>
