import * as types from './mutations-types'
const mutations = {
  [types.SET_TAB](state, tab) {
    state.tab = tab
  },
  [types.SET_BALANCE](state, balance) {
    state.balance = balance
  },
  [types.SET_TRANSFER](state, transfer) {
    state.transfer = transfer
  },
  [types.SET_CONTACT_WALLETADDRESS](state, address) {
    state.contact_walletAddress = address
  },
  [types.SET_TRANSFER_ADDRESS](state, address) {
    state.transfer.address = address
  }
}
export default mutations
