import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
Vue.use(Vuex)

// signStatus=> 1.注册手机号码页面  2.注册验证码页面 3.注册密码页面 4.登录页面  5.忘记密码-手机号码  6.忘记密码-验证码
// 7.忘记密码-重复密码

const store = new Vuex.Store({
  state: {
    tab: 0,
    balance: 0.0,
    transfer: {},
    contact_walletAddress: ""
  },
  mutations: mutations
})

export default store
