import * as types from './mutations-types'
const mutations = {
  [types.SET_TAB](state, tab) {
    state.tab = tab
  },
  [types.SET_BALANCE](state, balance) {
    state.balance = balance
  }
}
export default mutations
