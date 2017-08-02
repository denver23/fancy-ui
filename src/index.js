require('./css.sass');
require('babel-polyfill')
// node modules
require('script!zepto')
import Vue from 'vue';

new Vue({
  el: '.viewport',
  data: {
    appview: '',
  },
  components: {
    'account': resolve => require(['./views/account/'], resolve),
    'account/join': resolve => require(['./views/account/join'], resolve),
    'alert': resolve => require(['./views/alert'], resolve),
    'citypicker': resolve => require(['./views/citypicker'], resolve),
    'codemessage': resolve => require(['./views/codemessage'], resolve),
    'confirm': resolve => require(['./views/confirm'], resolve),
    'datetimepicker': resolve => require(['./views/datetimepicker'], resolve),
    'tree': resolve => require(['./views/tree'], resolve),
  },
  mounted() {
    let router = window.location.pathname.split('/').slice(1, 3).filter(v => !!v).join('/');
    this.appview = router || 'tree';
  },
})
