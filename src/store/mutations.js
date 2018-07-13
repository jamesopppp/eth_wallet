import * as types from './mutations-types'
const mutations = {
  [types.SET_TAB](state, tab) {
    state.tab = tab
  },
  [types.SET_ADDRESS](state, address) {
    state.address = address
  }
}
export default mutations
