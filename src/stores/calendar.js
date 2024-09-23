import {defineStore} from 'pinia'

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    today: new Date(),
    date: new Date(),
    view: 'week',
    calendars: [],
    appointments: new Map(),
    initiated: false
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
    },
    setCalendars(calendars) {
      this.calendars = calendars
    },
    addCalendar(calendar) {
      this.calendars = [...this.calendars, calendar]
    },
    updateCalendar(calendar) {
      this.calendars = this.calendars.map(c =>
        c.id === calendar.id ? calendar : c
      )
    },
    getCalendar(calendarId) {
      return this.calendars.find(c => c.id === calendarId)
    },
    setAppointments(calendarId, appointments) {
      const calendar = this.calendars.find(c => c.id === calendarId)
      if (!calendar) {
        return
      }
      this.appointments.set(calendarId, appointments)
    }
  }
})
