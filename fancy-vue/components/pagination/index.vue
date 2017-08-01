<style lang="sass">
  @import "~fancy_config"

  .fancy-pagination
    padding: $space
    ul
      text-align: center
      display: flex
      align-items: center
      justify-content: center
    li
      > a
        position: relative
        display: block
        height: $row-height
        width: $row-height
        color: #337ab7
        background-color: #fff
        text-decoration: none
        border: 1px solid $borderColor
        border-left: none
        box-sizing: border-box
        span
          position: absolute
          top: 50%
          left: 50%
          transform: translate3d(-50%, -50%, 0)
        &:hover
          color: #23527c
          background-color: #eee
          border-color: #ddd

      &:first-child,
      &:last-child
        > a
          width: auto
          padding: 0 $space * 2
      &:first-child
        > a
          border-left: 1px solid $borderColor
      &.active
        > a
          &,
          &:hover,
          &:focus
            color: #fff
            background-color: #337ab7
            border-color: #337ab7
            cursor: default
      &.disabled
        > a
          &,
          &:hover,
          &:focus
            color: #777
            background-color: #fff
            border-color: #ddd
            cursor: not-allowed

</style>

<template lang="jade">
  .fancy-pagination(v-if="cfg.total > 0")
    ul
      li(
        v-for="(v,index) in forData"
        v-bind:class="{'active': cfg.page == v.num, 'disabled': (index == 0 && v.num <=0 ) || ( index == forData.length - 1 && v.num > maxPage )}"
      )
        a(@click.prevent="_goto(v.num)" href="#" target="_self")
          span(v-text="v.text")
</template>

<script>

  const Options = {
    total    : 0,
    page     : 1,
    perpage  : 10,
    linknum  : 5,
    prevPage : '<',
    nextPage : '>',
    firstPage: '',
    lastPage : '',
    callback(page) {},
  }
  export default {
    props: ['cfg'],
    created() {
      Object.keys(Options).forEach(i => {
        (i in this.cfg) || this.$set(this.cfg, i, Options[i]);
      });
    },
    computed: {
      maxPage() {
        return Math.ceil(this.cfg.total / this.cfg.perpage);
      },
      forData() {
        let self = this;
        let res = [];
        let maxPage = this.maxPage;
        let page = Math.min(self.cfg.page, maxPage);
        let step = Math.ceil(self.cfg.linknum / 2);

        if (self.cfg.linknum > 2) {
          let begin = 0;
          let end = 0;
          begin = page - step + 1;
          end = page + step - 1;

          if (end >= maxPage) {
            begin = maxPage - self.cfg.linknum + 1;
            end = maxPage;
          }
          if (begin <= 0) {
            begin = 1;
            end = Math.min(self.cfg.linknum, maxPage);
          }
          for (let i = begin; i <= end; i++) {
            res.push({
              num: i,
              text: i
            });
          }
        };
        res.unshift({
          num: page - 1,
          text: self.cfg.prevPage
        });
        if (self.cfg.firstPage && page > step) {
          res.unshift({
            num: 1,
            text: self.cfg.firstPage,
          });
        }
        res.push({
          num: page + 1,
          text: self.cfg.nextPage,
        });
        return res;
      }
    },
    methods: {
      _goto(page) {
        if (page < 1 || page > this.maxPage) return;
        this.cfg.page = page;
        typeof this.cfg.callback == 'function' && this.cfg.callback(page);
      }
    }
  }
</script>
