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
      keepAlive: true,
      requireWallet: true
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
  }, {
    path: '/scan',
    name: 'scan',
    component: function (resolve) {
      require(['@/pages/scan/scan.vue'], resolve)
    },
    meta: {
      keepAlive: true
    }
  }, {
    path: '/open-home',
    name: 'open-home',
    component: function (resolve) {
      require(['@/pages/open/open-home/open-home.vue'], resolve)
    },
    meta: {
      keepAlive: true
    }
  }, {
    path: '/open-create',
    name: 'open-create',
    component: function (resolve) {
      require(['@/pages/open/open-create/open-create.vue'], resolve)
    },
    meta: {
      keepAlive: true
    }
  }, {
    path: '/open-backup',
    name: 'open-backup',
    component: function (resolve) {
      require(['@/pages/open/open-backup/open-backup.vue'], resolve)
    },
    meta: {
      keepAlive: true
    }
  }, {
    path: '/open-mnemonic',
    name: 'open-mnemonic',
    component: function (resolve) {
      require(['@/pages/open/open-mnemonic/open-mnemonic.vue'], resolve)
    },
    meta: {
      keepAlive: true
    }
  }, {
    path: '/open-confirm',
    name: 'open-confirm',
    component: function (resolve) {
      require(['@/pages/open/open-confirm/open-confirm.vue'], resolve)
    },
    meta: {
      keepAlive: true
    }
  }]
})
