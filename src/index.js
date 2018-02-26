import Vue from 'vue'
import sidebar from 'fancy/sidebar'
require('./css.sass')
// require('babel-polyfill')
// node modules
require('script!zepto')

new Vue({
  el: '.viewport',
  data: {
    appview: '',
    sidebar: null,
    sideStatus: ''
  },
  components: {
    sidebar,
    'account': resolve => require(['./views/account/'], resolve),
    'account/join': resolve => require(['./views/account/join'], resolve),
    'alert': resolve => require(['./views/alert'], resolve),
    'citypicker': resolve => require(['./views/citypicker'], resolve),
    'codemessage': resolve => require(['./views/codemessage'], resolve),
    'confirm': resolve => require(['./views/confirm'], resolve),
    'datetimepicker': resolve => require(['./views/datetimepicker'], resolve),
    'tree': resolve => require(['./views/tree'], resolve),
    'searchview': resolve => require(['./views/searchview'], resolve),
  },
  mounted() {
    let self = this
    function _getRouter() {
      return window.location.pathname.split('/').slice(1, 3).filter(v => !!v).join('/')
    }
    function _toggle(name) {
      self.appview = name || 'searchview'
      window.history.pushState({ 'title': '' }, '', `/${name}`)
    }
    window.addEventListener('popstate', e => {
      this.appview = _getRouter() || 'searchview'
    })

    this.appview = _getRouter() || 'searchview'
    this.sidebar = {
      data: [
        {
          name: 'basic',
          children: [
            {
              name: 'tree',
              callback: () => _toggle('tree'),
            },
            {
              name: 'confirm',
              callback: () => _toggle('confirm'),
            },
            {
              name: 'datetimepicker',
              callback: () => _toggle('datetimepicker'),
            },
            {
              name: 'citypicker',
              callback: () => _toggle('citypicker'),
            },
            {
              name: 'codemessage',
              callback: () => _toggle('codemessage'),
            },
            {
              name: 'alert',
              callback: () => _toggle('alert'),
            }
          ]
        }
      ],
      onSlide(v) {
        self.sideStatus = v ? 'full' : ''
      },
      callback() {
        return {
          state: true
        }
      }

    }
  },
})
