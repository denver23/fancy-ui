<template lang="pug">
  .fancy-tree(:class="'fc-'+ (treelevel || 0) " v-if="data && data.length")
    ul(v-if="data.length")
      li(:class="{'fc-folded': v.folded}" v-for="(v,index) in data")
        div.fc-item
          .fc-arrow(@click="toggle(v)")
          .fc-name
            input(
              v-if="!v[cfg.field] || editIndex === index"
              type="text"
              v-bind="{value: v[cfg.field], placeholder: cfg.placeholder, disabled: v.__disabled}"
              @keydown.enter.stop="onSubmit($event, index, v)"
            )
            span(v-else @click="toggleName($event, index, v)") {{v[cfg.field]}}

          .fc-tool
            em.fc-pencil(v-if="cfg.editBtn && v.editBtn !== false" @click="onEdit($event, index, v)")
            em.fc-plus(v-if="cfg.insertBtn && v[cfg.field] && cfg.maxLevel > (treelevel || 0)" @click="onCreate($event, index, v)")
            em.fc-trash(v-if="cfg.removeBtn && (!v.data || !v.data.length)" @click="onRemove(index, v)")
        treeview(
          v-if="v.data && v.data.length && (treelevel || 0) < cfg.maxLevel"
          v-bind:tree="v"
          v-bind:treelevel="(treelevel || 0) + 1"
          v-bind:treeMaxLevel="maxLevel - 1"
          v-bind:cfg="cfg"
        )
</template>

<script src="./script.ts"></script>

<style lang="sass">
  @import "~fancy_style"

  .fancy-tree
    margin: 0 auto
    $lineHeight: 2rem
    $form-height: 2rem
    $colorHover: #f60
    &.fc-0
      padding: $space * 2 0
      > ul
        > li
          padding-left: 0
          &:before,&:after
            border: none
    ul,li
      padding: 0
      margin: 0
      list-style: none
    li
      padding-left: $space * 4
      position: relative
      input
        height: $form-height
        &[type="text"]
          border: 1px solid $borderColor
          line-height: normal
          &:focus
            border-color: $colorAlerm
      // lines
      &::before,
      &::after
        content: ""
        position: absolute
        top: 0
        left: $space
        bottom: 0
        border-left: 1px solid $borderColor
      &::after
        border: none
        top: $lineHeight / 2 + $space
        bottom: auto
        border-top: 1px solid $borderColor
        width: $lineHeight / 2 + $space
      &:last-child
        &::before,
        &::after
          bottom: $lineHeight / 2 + $space
        &::after
          top: auto
      > div
        &:first-child
          display: flex
          align-items: center
          padding: $space
          > .fc-name
            flex: 1
            span
              cursor: pointer
          &:hover
            background: #eee
          // if has children, show arrow
          &:not(:last-child)
            > .fc-arrow
              display: inline-block
              height: $lineHeight
              width: $lineHeight
              position: relative
              cursor: pointer
              margin-left: -$lineHeight/2
              &::before
                content: ""
                position: absolute
                top: 50%
                left: 50%
                height: 0
                width: 0
                border-left: 0.6rem solid #999
                border-top: 0.4rem solid transparent
                border-bottom: 0.4rem solid transparent
                transform-origin: 0 center
                transition: transform 0.2s ease-in
                transform: translate3d(0, -100%, 0) rotate(90deg)
              &:hover
                &::before
                  border-left-color: $colorHover

        .fc-tool
          em
            display: inline-block
            height: $lineHeight
            width: $lineHeight
            opacity: 0.3
            cursor: pointer
            background: url(images/android-create.svg?fill=#{$colorFont}) no-repeat center
            background-size: 80%
            &:hover
              opacity: 1
            &.fc-plus
              background-image: url(images/android-add.svg?fill=#{$colorFont})
            &.fc-trash
              background-image: url(images/ios-trash-outline.svg?fill=#{$colorFont})

      &.fc-folded
        > div
          &:first-child:not(:last-child)
            > .fc-arrow
              &::before
                 transform: translate3d(-50%,-50%,0)
          &:last-child:not(:first-child)
            display: none
</style>


