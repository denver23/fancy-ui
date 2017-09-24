<style lang="sass" src="./style.sass">
</style>

<template lang="jade">
  .fancy-account
    form(method="post" @submit="_submit" onsubmit="return false")
      dl
        dt(v-if="cfg.account.label") {{cfg.account.label}}
        dd.fc-account
          input(ref="account" type="text" v-model="account" v-bind="{name: cfg.account.name, maxlength: cfg.account.maxlength, placeholder: cfg.account.placeholder}")

        dt(v-if="cfg.password.label") {{cfg.password.label}}
        dd.fc-password
          input(ref="password" type="password" v-model="password" v-bind="{name: cfg.password.name, maxlength: cfg.password.maxlength, placeholder: cfg.password.placeholder}")

        template(v-if="cfg.captcha.name")
          dt(v-if="cfg.captcha.label") {{cfg.captcha.label}}
          dd.fc-captcha
            div
              input(ref="captcha" type="text" v-model="captcha" v-bind="{maxlength: cfg.captcha.maxlength, placeholder: cfg.captcha.placeholder}")
            div
              img(:src="codeimg" @click="_captcha" )

        dd.fc-tip(v-if="message")
          span(v-text="message")
        dd.fc-btns
          input.fc-submit(:value="cfg.submit.name" type="submit")

</template>

<script>

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
    captcha: {
      label: '',
      name: 'captcha',
      url: '?c=Verify',
      maxlength: 4,
      placeholder: 'Captcha',
    },
    submit: {
      name: 'Sign In',
    },
    onSubmit(data, refs){}
  }
  export default {
    props: ['cfg'],
    data() {
      return {
        tt: 0,
        message: false,
        locked: false,
        account: '',
        password: '',
        captcha: '',
      }
    },
    created() {
      Object.keys(Options).forEach(i => {
        (i in this.cfg) || this.$set(this.cfg, i, Options[i])
      })
    },
    computed: {
      codeimg() {
        let v = this.cfg.captcha
        return v.url + (v.url.indexOf('?') < 0 ? '?' : '&') + 'tt=' + this.tt
      }
    },
    methods: {
      _showtip(str) {
        requestAnimationFrame(() => this.message = str)
      },
      _captcha() {
        this.tt = Date.now()
        if (this.$refs.captcha) {
          this.$refs.captcha.value = ''
        }
      },
      _submit: async function() {
        let data = {}
        let cfg = this.cfg
        data[cfg.account.name] = this.account.trim()
        data[cfg.password.name] = this.password.trim()
        data[cfg.captcha.name] = this.captcha.trim()

        this.message = ''
        if (this.locked) return
        try {
          this.locked = true
          await cfg.onSubmit(data, this.$refs)
        } catch (err) {
          this.locked = false
          this._captcha()
          this._showtip(err)
        }
        this.locked = false
      },
    },
  }

</script>
