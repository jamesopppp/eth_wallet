import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
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
    }
  }, {
    path: '/transaction',
    name: 'transaction',
    component: function (resolve) {
      require(['@/pages/transaction/transaction.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/my',
    name: 'my',
    component: function (resolve) {
      require(['@/pages/my/my.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/about',
    name: 'about',
    component: function (resolve) {
      require(['@/pages/about/about.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/scan',
    name: 'scan',
    component: function (resolve) {
      require(['@/pages/scan/scan.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/open-home',
    name: 'open-home',
    component: function (resolve) {
      require(['@/pages/open/open-home/open-home.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/open-create',
    name: 'open-create',
    component: function (resolve) {
      require(['@/pages/open/open-create/open-create.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/open-backup',
    name: 'open-backup',
    component: function (resolve) {
      require(['@/pages/open/open-backup/open-backup.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/open-mnemonic',
    name: 'open-mnemonic',
    component: function (resolve) {
      require(['@/pages/open/open-mnemonic/open-mnemonic.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/open-confirm',
    name: 'open-confirm',
    component: function (resolve) {
      require(['@/pages/open/open-confirm/open-confirm.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/transfer',
    name: 'transfer',
    component: function (resolve) {
      require(['@/pages/transfer/transfer.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/addBit',
    name: 'addBit',
    component: function (resolve) {
      require(['@/pages/addBit/addBit.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/bitDetails',
    name: 'bitDetails',
    component: function (resolve) {
      require(['@/pages/bitDetails/bitDetails.vue'], resolve)
    }
  }, {
    path: '/orderDetails',
    name: 'orderDetails',
    component: function (resolve) {
      require(['@/pages/orderDetails/orderDetails.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/importWallet',
    name: 'importWallet',
    component: function (resolve) {
      require(['@/pages/importWallet/importWallet.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/exportKeystore',
    name: 'exportKeystore',
    component: function (resolve) {
      require(['@/pages/exportKeystore/exportKeystore.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/tokenIssue',
    name: 'tokenIssue',
    component: function (resolve) {
      require(['@/pages/tokenIssue/tokenIssue.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/contact',
    name: 'contact',
    component: function (resolve) {
      require(['@/pages/contact/contact.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/addContact',
    name: 'addContact',
    component: function (resolve) {
      require(['@/pages/AddContact/AddContact.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/serviceAgreement',
    name: 'serviceAgreement',
    component: function (resolve) {
      require(['@/pages/serviceAgreement/serviceAgreement.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/privacyAgreement',
    name: 'privacyAgreement',
    component: function (resolve) {
      require(['@/pages/privacyAgreement/privacyAgreement.vue'], resolve)
    },
    meta: {}
  }, {
    path: '/contactUs',
    name: 'contactUs',
    component: function (resolve) {
      require(['@/pages/contactUs/contactUs.vue'], resolve)
    },
    meta: {}
  }]
})

export default router;
