import Vue from 'vue';
import App from './App';
import router from './router';
import Vuetify from 'vuetify';
import store from './store/store';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'animate.css';
import VueQrcode from '@xkeshi/vue-qrcode';
import bip39 from 'bip39';
import ethers from 'ethers';
import VueClipboard from 'vue-clipboard2';
import '../static/fontclass/iconfont.css';
import './assets/styles/base.css'
import {
  isOwnAccount
} from './config/utils';
// import Vconsole from 'vconsole'

// const vConsole = new Vconsole();
const whiteList = ['/open-home', '/open-create', '/open-backup', '/open-mnemonic', '/open-confirm'];

router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    if (from.path == '/home') {
      router.push({
        name: "home"
      })
    }
  } else {
    if (isOwnAccount()) {
      next();
    } else {
      next({
        path: "/open-home"
      });
    }
  }
  next();
})

Vue.config.productionTip = false;
Vue.prototype.bip39 = bip39;
Vue.prototype.ethers = ethers;
Vue.use(Vuetify);
Vue.use(VueClipboard);
Vue.component('qrcode', VueQrcode);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
