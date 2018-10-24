<style lang="sass" src="./style.sass">
</style>

<template lang="pug">
  .fancy-account
    form(method="post" @submit="_submit" onsubmit="return false" autocomplete="off")
      dl
        dt {{cfg.account.label}}
        dd.fc-account
          input(ref="account" type="text" v-model="account" v-bind="{maxlength: cfg.account.maxlength, placeholder: cfg.account.placeholder}")

        dt {{cfg.password.label}}
        dd.fc-password
          input(ref="password" type="password" v-model="password" v-bind="{maxlength: cfg.password.maxlength, placeholder: cfg.password.placeholder}")

        dt {{cfg.passwordRe.label}}
        dd.fc-password.fc-passwordRe
          input(ref="passwordRe" type="password" v-model="passwordRe" v-bind="{maxlength: cfg.passwordRe.maxlength, placeholder: cfg.passwordRe.placeholder}")

        dt {{cfg.captcha.label}}
        dd.fc-captcha
          div
            input(ref="captcha"  type="text" v-model="captcha" v-bind="{maxlength: cfg.captcha.maxlength, placeholder: cfg.captcha.placeholder}")
          div
            component(:cfg="cfg.captcha.codemessage" is="codemessage" v-if="cfg.captcha.codemessage")

        dd.fc-tip(v-if="message")
          span(v-text="message")
        dd.fc-btns
          input.fc-submit(:value="cfg.submit.name" type="submit")

</template>

<script>

  import codemessage from '../codemessage/'

  const Options = {
    account: {
      label: '',
      name: 'account',
      maxlength: 30,
      placeholder: 'Account',
    },
    password: {
      label: '',
      name: 'password',
      maxlength: 30,
      placeholder: 'Password',
    },
    passwordRe: {
      label: '',
      name: 'passwordRe',
      maxlength: 30,
      placeholder: 'Password Repeat',
    },
    captcha: {
      name: 'captcha',
      maxlength: 6,
      placeholder: 'Captcha',
      codemessage: {},
    },
    submit: {
      name: 'Join',
    },
    onSubmit(data, refs) {
    }
  }

  export default {
    components: {
      codemessage
    },
    props: ['cfg'],
    data() {
      return {
        tt: 0,
        message: false,
        locked: false,
        account: '',
        password: '',
        passwordRe: '',
        captcha: '',
      }
    },
    created() {
      Object.keys(Options).forEach(i => {
        (i in this.cfg) || this.$set(this.cfg, i, Options[i])
      })
    },
    methods: {
      _showtip(str) {
        requestAnimationFrame(() => this.message = str)
      },
      _submit: async function() {
        let cfg = this.cfg
        let data = {}
        data[cfg.account.name] = this.account.trim()
        data[cfg.password.name] = this.password.trim()
        data[cfg.passwordRe.name] = this.passwordRe.trim()
        data[cfg.captcha.name] = this.captcha.trim()

        this.message = ''
        if (this.locked) return
        try {
          this.locked = true
          await cfg.onSubmit(data, this.$refs)
        } catch (err) {
          this.locked = false
          return this._showtip(err)
        }
        this.locked = false
      },
    },
  }

</script>
