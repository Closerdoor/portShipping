import { login, logout, getInfo, wxLogin } from '@/api/user'
import { getToken, setToken, removeToken, setInfo, removeInfo } from '@/utils/auth'
import { resetRouter } from '@/router'
import request from '@/utils/request'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_LOGINNAME: (state, loginName) => {
    state.loginName = loginName
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { loginName, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginName: loginName.trim(), password: password }).then(response => {
        const { data } = response
        console.log('loginloginlogin')
        console.log(data)
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setInfo({
          userName: data.name,
          userId: data.accountId,
          organizationCode: data.organizationCode,
          organizationName: data.organizationName,
          pwdChange: data.passwordModificationStatus
        })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 企业微信登录
  wxLogin({ commit }, code) {
    // const { loginName, password } = userInfo
    return new Promise((resolve, reject) => {
      wxLogin(code).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setInfo({
          userName: data.loginName,
          userId: data.accountId,
          organizationCode: data.organizationCode,
          organizationName: data.organizationName,
          pwdChange: data.passwordModificationStatus
        })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { loginName, name, avatar } = data

        commit('SET_LOGINNAME', loginName)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then((res) => {
        console.log(res)
        removeToken() // must remove  token  first
        removeInfo()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeInfo()
      commit('RESET_STATE')
      resolve()
    })
  },

  getRouter({ commit }) {
    return request({
      url: '/api/Personal/MenuTree'
    })
  },

  // 跳转登录
  jumpLogin({ commit }, params) {
    return new Promise((resolve, reject) => {
      request({
        url: '/singlelogin',
        method: 'post',
        data: params
      }).then(res => {
        let token = res.data.token
        if (token.startsWith('Bearer')) {
          token = token.substring(7)
        }
        console.log('token::' + token)
        commit('SET_TOKEN', token)
        setToken(token)
        setInfo({
          userName: res.data.name,
          userId: res.data.accountId,
          organizationCode: res.data.organizationCode,
          organizationName: res.data.organizationName,
          pwdChange: res.data.passwordModificationStatus
        })
        resolve()
      }).catch(err => { reject(err) })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

