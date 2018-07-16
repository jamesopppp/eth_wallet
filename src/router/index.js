import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/home'
  }, {
    path: '/home',
    name: 'home',
    component: function (resolve) {
      require(['@/pages/home/home.vue'], resolve)
    },
    meta: {
      keepAlive: true
    }
  }, {
    path: '/transaction',
    name: 'transaction',
    component: function (resolve) {
      require(['@/pages/transaction/transaction.vue'], resolve)
    },
    meta: {
      keepAlive: true
    }
  }, {
    path: '/my',
    name: 'my',
    component: function (resolve) {
      require(['@/pages/my/my.vue'], resolve)
    },
    meta: {
      keepAlive: true
    }
  }, {
    path: '/about',
    name: 'about',
    component: function (resolve) {
      require(['@/pages/about/about.vue'], resolve)
    },
    meta: {
      keepAlive: true
    }
  }]
})
