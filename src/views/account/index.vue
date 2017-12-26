<style lang="sass">
  @import "../../config.sass"
  .test-account
    width: 25rem
    margin: 5rem auto 0
    color: #333
    background: #fff
    padding: $space
    border-radius: $borderRadius
    border: 1px solid $borderColor
    .join
      text-align: right
      a
        display: inline-block
        padding: $space * 2 $space * 2 $space
        color: $colorTheme
        &:hover

    @media #{$device-phone}
      margin: 0 $space
      width: auto
      position: fixed
      top: 10%
      left: $space
      right: $space


</style>

<template lang="pug">
  .test-account
    component(is="signin", :cfg="signin" v-if="signin")
    .join
      a(href="/account/join") Join
</template>

<script>
  import signin from 'fancy/account/signin';

  let times = 0;
  let admin = 'admin';
  export default {
    components: {
      signin
    },
    data() {
      let self = this;
      return {
        signin: {
          account: {
            label: 'Account',
            name: 'account',
            maxlength: 30,
            placeholder: 'Please input account',
          },
          password: {
            label: 'Password',
            name: 'password',
            maxlength: 30,
            placeholder: 'Please input password',
          },
          captcha: {
            label: 'Captcha',
            name: '',
            url: '?c=Verify',
            maxlength: 4,
            placeholder: 'Please input captcha',
          },
          submit: {
            name: 'Sign In',
          },
          onSubmit(data, refs) {
            return new Promise((resolve, reject) => {
              if(!data.account) return reject('account required')
              if(!data.password) return reject('password required')
              if(self.signin.captcha.name && !data.captcha) return reject('captcha required')

              if(data.account === admin && data.password === admin) {
                resolve()
                alert('signin success')
                return
              }
              times++
              if(times > 2) {
                setTimeout(() =>{
                  self.signin.captcha.name = 'captcha';
                }, 500)
              }
              if(times > 3) {
                return reject('account and password is "admin"')
              }
              reject('account or password error')
            })
          },
        },
      }
    },
    mounted() {
    },
  };
</script>
