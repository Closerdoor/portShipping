import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import center from './modules/center'
import YFB from './modules/YFB/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    showLeftMenu: true,
    loanForm: {},
    menuId: ''
  },
  mutations: {
    showLeftMenu(state, status) {
      state.showLeftMenu = status
    },
    setLoanForm(state, status) {
      status.type
        ? state.loanForm = { ...state.loanForm, ...status.data }
        : state.loanForm = {}
    },
    menuId(state, status) {
      state.menuId = status
    }
  },
  modules: {
    app,
    settings,
    user,
    center,
    YFB
  },
  getters
})

export default store
