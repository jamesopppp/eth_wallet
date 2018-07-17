import Vue from 'vue';
import App from './App';
import router from './router';
import Vuetify from 'vuetify';
import store from './store/store';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'animate.css';
import VueQrcode from '@xkeshi/vue-qrcode';
import bip39 from 'bip39';
import ethers from 'ethers';
import VueClipboard from 'vue-clipboard2';
import '../static/fontclass/iconfont.css';
import './assets/styles/base.css'
// import Vconsole from 'vconsole'

// const vConsole = new Vconsole();

router.beforeEach((to, from, next) => {
  let wallet = localStorage.getItem("wallet");
  if (to.meta.requireWallet) { // 判断该路由是否有钱包
    if (wallet) { // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: '/open-home',
      })
    }
  } else {
    next();
  }
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
