import Vue from 'vue'
import root from './root.vue'
import VueGtm from 'vue-gtm'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@fortawesome/fontawesome/styles.css'
import 'cryptocoins-icons/webfont/cryptocoins.css'

import CONFIG from '../utils/config'

Vue.config.productionTip = CONFIG.debug
Vue.use(ElementUI)
Vue.use(VueGtm, {
  debug: CONFIG.debug // Whether or not display console logs debugs (optional)
})

/* eslint-disable no-new */
new Vue({
  el: '#root',
  render: h => h(root)
})
