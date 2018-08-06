export const login = function () {
  console.log('JAnalytics:login');
  JAnalytics.addLoginEvent({
    'loginMethod': 'app',
    'isLoginSuccess': true
  });
}

export const register = function () {
  console.log('JAnalytics:register');
  JAnalytics.addRegisterEvent({
    'registerMethod': 'app',
    'isRegisterSuccess': true
  });
}

export const count = function () {
  JAnalytics.addCountEvent({
    'initiate transaction': 'transaction'
  });
}

// export const calculate = function () {
//   JAnalytics.addCalculateEvent({
//     'eventId': 'CalculateTest',
//     'eventValue': 1
//   });
// }

// export const see = function () {
//   JAnalytics.addBrowseEvent({
//     'browseId': 'BrowseTest',
//     'browseName': '深圳新闻',
//     'browseType': 'news',
//     'browseDuration': 10
//   });
// }

// export const transaction = function () {
//   JAnalytics.addPurchaseEvent({
//     'goodsId': 'initiate transaction',
//     'goodsName': '发起交易',
//     'price': 13.23232323,
//     'currency': 'ether',
//     'isPurchaseSuccess': true,
//     'goodsType': 'transaction',
//     'goodsCount': 1
//   });
// }
