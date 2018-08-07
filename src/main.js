import Vue from 'vue';
import App from './App';
import router from './router';
import Vuetify from 'vuetify';
import axios from 'axios';
// import {   Loadmore } from 'mint-ui'
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
// import Vconsole from 'vconsole' const vConsole = new Vconsole();
const whiteList = [
  '/open-home',
  '/open-create',
  '/open-backup',
  '/open-mnemonic',
  '/open-confirm',
  '/importWallet'
];

router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    if (from.path == '/home') {
      console.log('backHome');
      next('/transaction');
    } else {
      if (isOwnAccount()) {
        next('/home');
      }
    }
  } else {
    if (isOwnAccount()) {
      next();
    } else {
      if (to.path.indexOf('serviceAgreement') === -1) {
        next({
          path: "/open-home"
        });
      }
    }
  }
  next();
})

//  dev: 0  开发环境
//  build: 1  上线环境
const env = 1;

// 0 以太坊主服务器  1 rinkeby
const server = 0;

if (env === 0) {
  Vue.prototype.Api = '/api';
  if (server === 0) {
    Vue.prototype.provider = "homestead";
    Vue.prototype.currencyList = "/currencyList/currencyList.json"
  } else if (server === 1) {
    Vue.prototype.provider = "rinkeby";
    Vue.prototype.currencyList = "/currencyList/currencyList-test.json"
  }
} else if (env === 1) {
  Vue.prototype.Api = 'http://geewer.com';
  if (server === 0) {
    Vue.prototype.provider = "homestead";
    Vue.prototype.currencyList = "/currencyList/currencyList.json"
  } else if (server === 1) {
    Vue.prototype.provider = "rinkeby";
    Vue.prototype.currencyList = "/currencyList/currencyList-test.json"
  }
}


Vue.prototype.ApiKeyToken = '6CW7IKUWC5CZXV4H177CCVCQM1B6GYF8XC';
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.prototype.bip39 = bip39;
Vue.prototype.ethers = ethers;
Vue.use(Vuetify);
Vue.use(VueClipboard);
Vue.component('qrcode', VueQrcode);
// Vue.component('v-cityselect', CitySelect); Vue.component('v-loadmore',
// Loadmore);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
