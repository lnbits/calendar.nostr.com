import {defineStore} from 'pinia'
import {api} from 'boot/axios'

const savedUsername = localStorage.getItem('username')

export const useAccountStore = defineStore('account', {
  state: () => ({
    username: savedUsername
  }),
  getters: {
    isLoggedIn: state => !!state.username
  },
  actions: {
    addUsername(username) {
      this.username = username
      localStorage.setItem('username', username)
    },
    logout() {
      this.username = ''
      localStorage.clear()
    }
  }
})
