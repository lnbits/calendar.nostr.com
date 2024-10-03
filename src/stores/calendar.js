import {defineStore} from 'pinia'
import {formatDate} from 'src/utils/date'

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    today: new Date(),
    date: new Date(),
    view: 'week',
    calendars: [],
    appointments: new Map(),
    unavailable: new Map(),
    initiated: false
  }),
  getters: {
    // get date is type string
    getDateStr() {
      return formatDate(this.date)
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
    },
    updateAppointment(calendarId, appointment) {
      const currentAppointments = this.appointments.get(calendarId)
      const index = currentAppointments.findIndex(a => a.id === appointment.id)
      currentAppointments[index] = appointment
      this.appointments.set(calendarId, currentAppointments)
    },
    deleteAppointment(calendarId, id) {
      const currentAppointments = this.appointments
        .get(calendarId)
        .filter(a => a.id !== id)
      this.appointments.set(calendarId, currentAppointments)
    },
    getUnavailable(calendarId) {
      return this.unavailable.get(calendarId) || []
    },
    addUnavailable(calendarId, unavailable) {
      if (!this.unavailable.has(calendarId)) {
        this.unavailable.set(calendarId, [unavailable])
        return
      } else {
        const currentUnavailable = this.getUnavailable(calendarId)
        this.unavailable.set(calendarId, [...currentUnavailable, unavailable])
      }
    },
    deleteUnavailable(calendarId, id) {
      const currentUnavailable = this.unavailable
        .get(calendarId)
        .filter(u => u.id !== id)
      this.unavailable.set(calendarId, currentUnavailable)
    }
  }
})
