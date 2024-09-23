import {defineStore} from 'pinia'
import {api} from 'boot/axios'

const savedUsername = localStorage.getItem('username')

export const useAccountStore = defineStore('account', {
  state: () => ({
    username: savedUsername,
    wallets: []
  }),
  getters: {
    isLoggedIn: state => !!state.username
  },
  actions: {
    setWallets(wallets) {
      this.wallets = wallets
    }
  }
})
