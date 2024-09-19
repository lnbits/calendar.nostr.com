import {defineStore} from 'pinia'

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    date: new Date(),
    view: 'week',
    calendars: []
  }),
  getters: {
    // get date is type string
    getDateStr() {
      return this.date.toString()
    }
  },
  actions: {
    setDate(date) {
      console.log('setDate', date)
      this.date = Date(date)
    },
    setView(view) {
      this.view = view
    }
  }
})
