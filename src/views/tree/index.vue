<style lang="sass">
  @import "../../config.sass"
  .test-tree
    margin: 50px auto
</style>

<template lang="pug">
  .test-tree
    component(is="tree", :cfg="tree" v-if="tree")
</template>

<script>
import tree from 'fancy/tree/dragdrop'
import { setTimeout } from 'timers'

var treedata = [
  {
    name: 'level 1',
    data: [
      {
        name: 'level 1-1',
        data: [{ name: 'level 1-1-1' }, { name: 'level 1-1-2' }],
      },
      {
        name: 'level 1-2',
        data: [
          { name: 'level 1-2-1' },
          { name: 'level 1-2-2' },
          { name: 'level 1-2-3' },
          { name: 'level 1-2-4' },
          { name: 'level 1-2-5' },
          { name: 'level 1-2-6' },
          { name: 'level 1-2-7' },
          { name: 'level 1-2-8' },
        ],
      },
      {
        name: 'level 1-3',
        data: [
          { name: 'level 1-3-1' },
          { name: 'level 1-3-2' },
          { name: 'level 1-3-3' },
          { name: 'level 1-3-4' },
          { name: 'level 1-3-5' }],
      },
      { name: 'level 1-4' },
      { name: 'level 1-5' },
    ],
  },
  {
    name: 'level 2',
    data: [{ name: 'level 2-1' }, { name: 'level 2-2' }, { name: 'level 2-3' }, { name: 'level 2-4' }, { name: 'level 2-5' }],
  },
]

// let aa = treedata[0].data[0]
// let bb = treedata[0].data[1].data[1]
// setTimeout(() => {
//   aa.name = 'aaaa'
// }, 5000)

// setTimeout(() => {
//   bb.name = 1111
// }, 1000)

export default {
  components: {
    tree,
  },
  data() {
    return {
      tree: {
        data: treedata,
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
          return new Promise(resolve => {
            setTimeout(() => resolve(), 100)
          })
        },
        onRemove(item, parent) {
          return new Promise(resolve => {
            setTimeout(() => resolve(), 100)
          })
        },
      },
    }
  },
  mounted() {},
}
</script>
