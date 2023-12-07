import Cookies from 'js-cookie'
import store from '@/store'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  // return Cookies.get(TokenKey)
  return sessionStorage.getItem('Authorization')
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  return sessionStorage.setItem('Authorization', token)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  return sessionStorage.removeItem('Authorization')
}

export function getInfo() {
  return JSON.parse(sessionStorage.getItem('Info'))
}

export function setInfo(Info) {
  return sessionStorage.setItem('Info', JSON.stringify(Info))
}

export function removeInfo() {
  return sessionStorage.removeItem('Info')
}

export function getPagePromise() {
  console.log(sessionStorage.getItem('menuId'), 'ppppp')
  return store
    .dispatch('center/getPagePromise', { menuId: sessionStorage.getItem('menuId') })
    .then(res => {
      console.log('xxxxxx')
      console.log(res)
      return res.data.map(i => i.permission)
    })
}
