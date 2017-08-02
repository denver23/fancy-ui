<style lang="sass">
  @import "~fancy_style"

  .fancy-tables
    position: relative
    > ol,
    > ol > ul,
    > ol > ul > li
      list-style: none
      padding: 0
      margin: 0
    > ol
      > ul
        display: flex
        text-align: center
        border: 1px solid $borderColor
        border-bottom: none
        transition: opacity 0.5s ease
        opacity: 1
        &:last-child
          border-bottom: 1px solid $borderColor
        &:nth-child(2n)
          background: #f9f9f9
        &:hover
          background: #f2f2f2
        &.fc-header
          font-weight: bolder
        &.fc-fade-leave
          opacity: 0
        > li
          display: flex
          flex: 1 1 0
          align-items: center
          // justify-content: center
          border-right: 1px solid $borderColor
          &:last-child
            border-right: none
          &.fc-noflex
            flex: none
          > div,
          > label
            padding: $space * 2 $space
            flex: 1 1 0
            line-height: 1.6em
          > div
            > img
              max-height: $space * 6
              border: 1px solid $borderColor
              max-width: $space * 6
              vertical-align: middle

      @media #{$device-pad}
        > ul
          > li
            &.fc-noflex
              flex: 1
      @media #{$device-phone}
        > ul
          flex-wrap: wrap
          text-align: left
          &.fc-header
            display: none
          > li
            flex: 0 0 100%
            align-items: baseline
            border-bottom: 1px dashed #f1f1f1
            border-right: none
            &.fc-noflex
              flex: 0 0 100%
            > div
              padding: $space
              &::before
                content: attr(ps)
                color: #aaa
                padding-right: $space
              &:empty
                display: none
          input
            &[type="text"]
              width: 100%

    .fc-loading
      padding: $space * 2
      text-align: center
      &::before
        content: ""
        display: inline-block
        width: $row-height
        height: $row-height
        background: url(images/spinner.svg?fill=#{$colorTheme}) no-repeat center
        background-size: 100%
        animation: fancy-tables-loading 1s infinite steps(8)
        @keyframes fancy-tables-loading
          0%
            transform: rotate(0deg)
          100%
            transform: rotate(359deg)
    .fc-state
      padding: $space * 6 $space
      text-align: center
      color: #aaa
      &:empty
        display: none

    .fc-tool
      height: $row-height
      margin: 0 0 $space
      &:empty
        display: none

    .fc-picker
      float: right
      height: $row-height
      position: relative

      button
        border: 1px solid $borderColor
        height: $row-height
        line-height: normal
        border-radius: $borderRadius
        padding-right: $space * 4
        cursor: pointer
        background: #fff
        position: relative
        box-sizing: border-box
        color: $colorFont
        &::after
          $_s: $row-height / 6
          content: ""
          position: absolute
          right: $space
          top: 50%
          width: 0
          height: 0
          border-left: $_s solid transparent
          border-right: $_s solid transparent
          border-top: $_s * 5 / 4 solid $colorFont
          transform: translateY(-50%)
      > div
        min-width: 10rem
        position: absolute
        top: $row-height
        right: 0
        margin-top: 2px
        background: #fff
        box-shadow: 0 0 6px $borderColor
      label
        line-height: 2em
        height: 2em
        padding: 0 $space
        display: block
        cursor: pointer
        font-weight: normal
        &:hover
          background: #ddd
      input
        margin: 0 0.5rem 0 0
</style>

<template lang="jade">
  .fancy-tables
    .fc-tool
      .fc-picker(ref="picker" v-if="cfg.picker")
        button(@click.stop="pickerState = !pickerState") {{cfg.picker}}
        div(v-show="pickerState" @click.stop="")
          label(v-for="(v, k) in cfg.columns" v-show="v.label")
            input(type="checkbox" v-bind:value="k" v-model="pickerData")
            span {{v.label}}
    ol
      ul.fc-header
        template(v-for="(v, index) of cfg.columns")
          li(
            v-if="pickerData.includes(index) || v.label === 'checkbox'"
            v-bind:class="[v.field, {'fc-noflex': v.style && v.style.width}]"
            v-bind:style="v.style"
          )
            label(v-if="v.label === 'checkbox'" )
              input(type="checkbox" @click="_onChkAll(v)" v-model="modelAll[v.field]")
            div(v-else v-html="v.label")

      ul(v-if="cfg.data && cfg.data.length" v-for="value of cfg.data" transition="fc-fade")
        template(v-for="(v, index) of cfg.columns")
          li(
            v-if="pickerData.includes(index) || v.label === 'checkbox'"
            v-bind:class="[v.field, {'fc-noflex': v.style && v.style.width}]"
            v-bind:style="v.style"
          )
            label(v-if="v.label === 'checkbox'")
              input(type="checkbox" v-bind:value="value[v.field]" v-model="cfg.values[v.field]" @click="_onChk(v.field,value)")
            div(v-else v-bind:ps="v.label" v-html="(typeof v.callback == 'function' ? v.callback(value) : value[v.field])")

    .fc-loading(v-if="cfg.state === 'loading'")
    .fc-state(v-else v-html="cfg.state")
    //- | {{cfg.values}}

</template>

<script>
  const Options = {
    data: '',
    columns: '',
    picker: '',
    values: {},
    state: 'loading',
  };
  export default {
    props: ['cfg'],
    data() {
      return {
        pickerState: false,
        pickerData: [],
        modelAll: {},
      };
    },
    created() {
      let cfg = this.cfg
      Object.keys(Options).forEach(i => {
        (i in cfg) || this.$set(cfg, i, Options[i]);
      });
      cfg.columns && cfg.columns.forEach((v, k) => {
        this.pickerData.push(k);
        v.label === 'checkbox' && this.$set(this.modelAll, v.field, false);
      });
    },
    mounted() {
      document.addEventListener('click', this._onPicker, false);
    },
    destroyed() {
      document.removeEventListener('click', this._onPicker, false);
    },
    watch: {
      'cfg.data' (val) {
        for (let i in this.modelAll){
          this.modelAll[i] = false;
          this.cfg.values[i] = [];
        }
      }
    },
    methods: {
      _onPicker() {
        this.pickerState = false;
      },
      _onChkAll(column) {
        let key = column.field;
        let arr = this.cfg.values[key] || [];
        arr.splice(0);
        this.modelAll[key] && this.cfg.data.forEach(v => arr.push(v[key]));
      },
      _onChk(key, item) {
        this.modelAll[key] = this.cfg.values[key] && this.cfg.values[key].includes(item[key]) && this.cfg.values[key].length === this.cfg.data.length;
      },
    }
  }

</script>
