import Vue from 'vue'

const dynamicTable = {
  state: {
    hideList:{}
  },
  mutations: {
    set_hideList(state, {key,value}) {
      Vue.set(state.hideList, key, value)
      localStorage.setItem('hideList', JSON.stringify(state.hideList))
    }
  },
}

export default dynamicTable
