import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    registerState: false,
    switch: 0,
  },
  mutations: {
    changeRegisterState(state) {
      state.registerState = !state.registerState
    },
    changeSwitch(state, index) {
      state.switch = index
    },
    resetSwitch(state) {
      state.switch = 1
    },
  },
  getters: {
    getSwitch(state) {
      return state.switch
    },
  },
})

export default store
