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
    .signin
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

<template lang="jade">
  .test-account
    component(is="join", :cfg="join" v-if="join")
    .signin
      a(href="/account/") Signin
</template>

<script>
  import join from 'fancy/account/join';

  let times = 0;
  let isMobile = function(str) {
    return /^1[3|4|5|7|8][0-9]\d{8}$/.test(str);
  };
  export default {
    components: {
      join
    },
    data() {
      let self = this;
      return {
        join: {
          account: {
            label: 'Mobile',
            name: 'mobile',
            maxlength: 11,
            placeholder: 'Please input mobile',
          },
          password: {
            label: 'Password',
            name: 'password',
            maxlength: 30,
            placeholder: 'Please input password',
          },
          passwordRe: {
            label: 'Password Repeat',
            name: 'passwordRe',
            maxlength: 30,
            placeholder: 'Please password again',
          },
          captcha: {
            label: 'Captcha',
            name: 'captcha',
            maxlength: 4,
            placeholder: 'Please input captcha',
            codemessage: {
              show: true,
              text: 'Send',
              repeat: 'Resend code',
              duration: 60,   // second
              history: 0,     // second
              auto: false,
              onSubmit() {},
            }
          },
          submit: {
            name: 'Join',
          },
          onSubmit(data, refs) {
            return new Promise((resolve, reject) => {
              if(!data.mobile) return reject('mobile required')
              if(!isMobile(data.mobile)) return reject('mobile invalid')
              if(!data.password) return reject('password required')
              if(data.passwordRe !== data.password) return reject('password not same')
              if(!data.captcha) return reject('captcha required')

              times++;
              if(data.mobile === '13500000000' && data.password === 'test') {
                resolve()
                alert('join success')
                return
              }
              if(times > 3) {
                return reject('mobile is 13500000000 and password is test')
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
