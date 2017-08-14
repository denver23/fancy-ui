<style lang="sass">
  @import "~fancy_style"

  @mixin in-mobile()
    label
      padding: 0
    > dl
      display: block
      padding: 0 $space
      > dt
        text-align: start
        color: $colorFont
      > dd
        > input,
        > select,
        > textarea
          display: block
          width: 100%
          min-width: 0
          max-width: 100%
          margin-bottom: $space * 2
        > label
          padding-right: $space * 2
        > input
          &[type="submit"]
            ~ cite
              position: static
              display: block
              text-align: center
              line-height: $form-height
              border: none
              background: none
              transform: none
              animation: none
              &::before
                display: none
            &:disabled
              ~ cite
                position: absolute
                top: 0
                right: 0
                left: auto
                width: $form-height
                &::after
                  animation: fancy-forms-sending2 1s infinite steps(8)
                  @keyframes fancy-forms-sending2
                    0%
                      transform: rotate(0)
                    100%
                      transform: rotate(359deg)

  .fancy-forms
    *
      box-sizing: border-box
    label
      display: inline-block
      line-height: $form-height
      margin: 0
      > input
        &[type="radio"],
        &[type="checkbox"]
          display: none
          + span
            display: inline-block
            padding-left: 2rem
            background-repeat: no-repeat
            background-position: 0 center
            background-size: 1.5rem auto
        &[type="radio"]
          + span
            background-image: url(images/android-radio-button-off.svg?fill=#{$colorFont})
          &:checked
            + span
              background-image: url(images/android-radio-button-on.svg?fill=#{$colorFont})
        &[type="checkbox"]
          + span
            background-image: url(images/android-checkbox-outline-blank.svg?fill=#{$colorFont})
          &:checked
            + span
              background-image: url(images/android-checkbox-outline.svg?fill=#{$colorFont})
    > dl
      padding: $space
      display: flex
      flex-wrap: nowrap
      &:empty
        display: none
      > dt
        min-width: 8rem
        text-align: right
        color: $colorFont
        > label 
          padding: 0 $space
      > dd
        position: relative
        &:first-of-type:last-of-type
          flex: 1 1 0
        > label
          padding-right: $space * 2
        > cite
          $_tip: $space * 2
          display: block
          position: absolute
          z-index: 10
          left: 0
          top: $form-height
          line-height: $form-height
          padding: 0 $space
          color: $colorAlerm
          font-style: normal
          background: lighten($colorAlerm, 42%)
          border: 1px solid $colorAlerm
          transform: translate3d(0, $_tip, 0)
          animation: fancy-forms-tips 3s ease-in forwards
          @keyframes fancy-forms-tips
            0%, 10%, 20%, 30%
              opacity: 1
              transform: translate3d(0, $_tip, 0)
            5%, 15%, 25%
              opacity: 1
              transform: translate3d($space, $_tip, 0)
            80%
              opacity: 1
            100%
              opacity: 0
          &::before
            content: ""
            border: $colorAlerm solid
            border-width: 0 0 1px 1px
            width: $_tip
            height: $_tip
            position: absolute
            z-index: 3
            left: 0
            top: 0
            background: lighten($colorAlerm, 42%)
            transform: translate3d($_tip, -50%, 0) rotate(135deg)

        > span
          line-height: $form-height
        > input,
        > select,
        > textarea
          display: inline-block
          height: $form-height
          padding: 0 $space
          margin-right: $space
          min-width: 20rem
          color: $colorFont
          border: 1px solid $borderColor
          -webkit-appearance: none
          border-radius: 0
          &:focus
            border: 1px solid $colorAlerm
            outline: none

        > input
          &[type="text"]
            line-height: normal
          &[type="submit"],
          &[type="button"],
          &[type="reset"]
            @include mixin-button()
            min-width: 10rem
            cursor: pointer

          &[type="reset"]
            color: $colorFont
            background: #f1f1f1
            &:hover
              color: $colorTheme
          &[type="submit"]
            ~ cite
              position: static
              display: inline
              line-height: $form-height
              border: none
              background: none
              transform: none
              animation: none
              &::before
                display: none
            &:disabled
              ~ cite
                position: relative
                top: 0
                left: 0
                &::after
                  content: ""
                  position: absolute
                  top: 50%
                  left: 0
                  height: $form-height
                  width: $form-height
                  background: url(images/spinner.svg?fill=#fff) no-repeat center
                  background-size: auto 50%
                  animation: fancy-forms-sending 1s infinite steps(8)
                  @keyframes fancy-forms-sending
                    0%
                      transform: translate3d(-120%, -50%, 0) rotate(0)
                    100%
                      transform: translate3d(-120%, -50%, 0) rotate(359deg)


          &[type="number"]
            &::-webkit-inner-spin-button,
            &::-webkit-outer-spin-button
              -webkit-appearance: none
              margin: 0
        > select
          option
            padding: $space
        > textarea
          line-height: 1.5em
          min-height: 10rem
          padding: $space

    &.fc-search
      > dl
        flex-wrap: wrap
        > dd
          > input,
          > select,
          > textarea
            min-width: 8rem
            margin-bottom: $space

    &.fc-column
      @include in-mobile()
    @media #{$device-mobile}
      @include in-mobile()
  </style>

<template lang="jade">
  form.fancy-forms(
    :class="'fc-'+ (cfg.type || 'forms')"
    ref="form"
    @submit="_submit"
    method="post"
    autocomplete="off"
    onSubmit="return false"
  )
    template(v-for="row of cfg.data")
      dl(v-bind="row.attr")
        template(v-if="v" v-for="v in (row.children || row)")
          dt(v-if="typeof v.label !== 'undefined'")
            label(:for="v.id || v.name" v-html="v.label" v-if="v.label")
          dd
            input(
              v-if="!v.type || v.type === 'text'"
              type="text"
              v-bind="[{id: v.id || v.name, name: v.name}, v.attr]"
              v-model="cfg.value[v.name]"
            )
            template(v-else)
              input(
                v-if="['reset','button'].includes(v.type)"
                v-bind="[{type: v.type, name: v.name, value: v.value}, v.attr]"
              )
              input(
                v-else-if="v.type === 'submit'"
                type="submit"
                v-bind="[{name: v.name, value: v.value}, v.attr]"
                v-bind:disabled="sending"
              )

              input(
                v-else-if="['number','tel', 'password','hidden'].includes(v.type)"
                v-bind="[{type: v.type, name: v.name, value: v.value, id: v.id || v.name}, v.attr]"
                v-model="cfg.value[v.name]"
              )

              textarea(
                v-else-if="v.type === 'textarea'"
                v-bind="[{id: v.id || v.name, name: v.name}, v.attr]"
                v-model="cfg.value[v.name]"
              )

              select(
                v-else-if="v.type === 'select'"
                v-bind="[{id: v.id || v.name, name: v.name}, v.attr]"
                v-model="cfg.value[v.name]"
              )
                option(
                  v-for="vv of v.data"
                  v-bind:value="typeof vv === 'string' ? vv : vv.value"
                  v-html="vv.label || vv.value || vv"
                )

              label(v-else-if="v.type === 'radio'" v-for="(vv,k) of v.data")
                input(
                  type="radio"
                  v-bind:name="v.name"
                  v-bind:value="vv.value"
                  v-model="cfg.value[v.name]"
                )
                span(v-html="vv.label")

              template(v-else-if="v.type === 'checkbox'")
                label(v-if="v.checkAll")
                  input(
                    type="checkbox",
                    v-bind:name="v.name",
                    v-bind:value="v.checkAll.value"
                    v-model="checkAll[v.name]"
                    @click="_onChkAll(v)"
                  )
                  span(v-html="v.checkAll.label")
                label(v-for="(vv,k) of v.data")
                  input(
                    type="checkbox"
                    v-bind:name="v.name"
                    v-bind:value="vv.value"
                    v-model="cfg.value[v.name]"
                    @click="_onChk(v, vv)"
                  )
                  span(v-html="vv.label")

              component(:is="v.name" v-bind:cfg="v.value" v-else-if="v.type === 'component' && v.value" )
              //- others
              span(v-else v-html="cfg.value[v.name]" v-bind="attr")

            //- tips
            cite(v-if="tips[v.name] || (sending && v.type === 'submit')" v-text="tips[v.name]")
</template>

<script>

function getQueryAll() {
  let res = {};
  let str = window.location.search.substr(1);
  str != null && str.replace(/([^=&]+)=([^&]*)/g, (all, key, value) => {
    value && (res[key] = decodeURIComponent(value));
  });
  return res;
}

const Options = {
  data: false,
  type: '', // search column forms
  value: {},
  pushstate: false, // object
  onReset(form, data) { },
  onReady(form, data) { },
  onSubmit(form, data) { },
  onPopstate(form, data) { },
  validator: false,
};

export default {
  props: ['cfg'],
  data() {
    return {
      tips: {},
      sending: false,
      submitName: '_submit_',
      checkAll: {},
    }
  },
  created() {
    Object.keys(Options).forEach(i => {
      (i in this.cfg) || this.$set(this.cfg, i, Options[i]);
    });

    let cfg = this.cfg;
    if (cfg.type === 'search') {
      Object.assign(cfg.value, getQueryAll());
      typeof cfg.onPopstate === 'function' && window.addEventListener("popstate", e => {
        cfg.value = getQueryAll();
        cfg.onPopstate(this.$refs.form, cfg.value);
      });
    }
    // validator and submit
    cfg.data && cfg.data.forEach(val => (val.children || val).forEach(v => {
      if (v.type === 'submit') {
        this.submitName = v.name || '_submit_';
        this.$set(this.tips, this.submitName, '');
        this.$set(v, 'name', this.submitName);
      } else if (v.name && !['reset', 'button', 'component'].includes(v.type)) {
        this.$set(this.tips, v.name, '');
        this.$set(cfg.value, v.name, (v.name in cfg.value) ? cfg.value[v.name] : (v.value || ''));
        // set checkAll
        if (v.type === 'checkbox' && v.checkAll) {
          let _chked = true;
          for (let _chk of v.data) {
            if (!cfg.value[v.name].includes(_chk.value)) {
              _chked = false;
              break;
            }
          }
          this.checkAll[v.name] = _chked;
        }
      }
    }));
  },
  mounted() {
    requestAnimationFrame(() => {
      let cfg = this.cfg;
      if (typeof cfg.onReady === 'function') {
        cfg.onReady(this.$refs.form, cfg.value);
      }
      if (typeof cfg.onReset === 'function') {
        let inp = this.$el.querySelector('input[type="reset"]');
        inp && inp.addEventListener('click', cfg.onReset);
      }
    });
  },
  watch: {
    'cfg.pushstate'(val) {
      if (typeof val === 'object') {
        let url = window.location.href.split('?')[0];
        let param = Object.entries(val).map(v => v[1] && v.join('=')).filter(v => v).join('&');
        window.history.pushState({
          'title': ''
        }, '', `${url}?${param}`);
      }
    },
  },
  methods: {
    _onChkAll(v) {
      let arr = this.cfg.value[v.name];
      arr.splice(0);
      if (this.checkAll[v.name]) {
        v.data.forEach(v => arr.push(v.value));
        if (typeof v.checkAll.value != 'undefined') arr.push(v.checkAll.value)
      }
    },
    _onChk(v, vv) {
      if (v.checkAll) {
        let _val = this.cfg.value[v.name];
        if (_val && _val.includes(vv.value)) {
          if (_val.length == v.data.length) {
            this.checkAll[v.name] = v.checkAll.value || true;
            if (typeof v.checkAll.value != 'undefined') _val.push(v.checkAll.value);
          }
        } else {
          this.checkAll[v.name] = false;
          let _i = _val.findIndex(n => n === v.checkAll.value);
          if (_i >= 0) _val.splice(_i, 1)
        }
      }
    },
    _submit: async function () {
      let cfg = this.cfg;
      if (cfg.validator) {
        for (let [key, _func] of Object.entries(cfg.validator)) {
          let res = _func(cfg.value[key], cfg.value);
          if (res !== true) {
            this.tips[key] = false;
            this.$el.querySelector(`[name="${key}"]`).focus();
            requestAnimationFrame(() => this.tips[key] = res);
            return;
          }
        }
      }

      this.tips[this.submitName] = '';
      if (this.sending) return;
      this.sending = true;
      try {
        cfg.onSubmit && await cfg.onSubmit(this.$refs.form, cfg.value);;
      } catch (err) {
        this.tips[this.submitName] = err;
      }
      this.sending = false;
    },
  },
}

</script>
