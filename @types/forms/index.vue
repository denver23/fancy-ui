<template lang="pug">
  form.fancy-forms(
    :class="'fc-'+ (cfg.category || 'forms')"
    ref="form"
    @submit="onSubmit"
    method="post"
    autocomplete="off"
    onSubmit="return false"
  )
    template(v-for="row of cfg.data")
      dl(v-if="row")
        template(v-if="v" v-for="v of (Array.isArray(row) ? row : [row])")
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
                ,:disabled="sending"
              )

              input(
                v-else-if="['number','tel', 'password','hidden'].includes(v.type)"
                v-bind="[{name: v.name, value: v.value, id: v.id || v.name}, v.attr]"
                ,:type="v.type"
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
                  ,:value="typeof vv === 'string' ? vv : vv.value"
                  v-html="vv.label || vv.value || vv"
                )

              label(v-else-if="v.type === 'radio'" v-for="(vv,k) of v.data")
                input(
                  type="radio"
                  ,:name="v.name"
                  ,:value="vv.value"
                  v-model="cfg.value[v.name]"
                )
                span(v-html="vv.label")

              template(v-else-if="v.type === 'checkbox'")
                label(v-if="v.checkAll")
                  input(
                    type="checkbox",
                    ,:name="v.name"
                    ,:value="v.checkAll.value"
                    v-model="checkAll[v.name]"
                    @click="onChkAll(v)"
                  )
                  span(v-html="v.checkAll.label")
                label(v-for="(vv,k) of v.data")
                  input(
                    type="checkbox"
                    ,:name="v.name"
                    ,:value="vv.value"
                    v-model="cfg.value[v.name]"
                    @click="onChk(v, vv)"
                  )
                  span(v-html="vv.label")

              component(:is="v.name",:cfg="v.value" v-else-if="v.type === 'component' && v.value" )
              //- others
              span(v-else v-html="v.value" v-bind="v.attr")

            //- tips
            cite(v-if="tips[v.name] || (sending && v.type === 'submit')" v-text="tips[v.name]")
</template>

<script src="./script.ts"></script>

<style lang="sass">
  @import "~fancy_style"
  @import "~fancy_mixins"

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
            mask-repeat: no-repeat
            mask-position: 0 center
            mask-size: 1.5rem auto
            background: $colorFont
        &[type="radio"]
          + span
            mask-image: url(images/android-radio-button-off.svg)
          &:checked
            + span
              mask-image: url(images/android-radio-button-on.svg)
        &[type="checkbox"]
          + span
            mask-image: url(images/android-checkbox-outline-blank.svg)
          &:checked
            + span
              mask-image: url(images/android-checkbox-outline.svg)
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
                  mask: url(images/spinner.svg) no-repeat center
                  mask-size: auto 50%
                  background-color: #fff
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
