<template>
  <q-page class="q-pa-md container">
    <div class="q-gutter-md">
      <q-breadcrumbs
        class="text-grey-4 q-mb-lg"
        active-color="secondary"
      >
        <q-breadcrumbs-el
          icon="home"
          to="/"
        />
        <q-breadcrumbs-el
          label="Calendars"
          to="/"
        />
        <q-breadcrumbs-el :label="calendar.name" />
      </q-breadcrumbs>
    </div>
    <div v-if="fullcalendar">
      <FullCalendar
        :events="$cal.appointments.get(calendar.id)"
        :close="() => (fullcalendar = false)"
      />
    </div>
    <q-card
      v-else
      class="nostr-card text-white no-shadow q-my-xl"
      bordered
    >
      <q-tabs
        v-model="tab"
        dense
        class="text-grey q-pa-sm"
        active-color="secondary"
        indicator-color="secondary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          v-if="calendar"
          name="appointments"
          label="Appointments"
        />
        <q-tab
          v-if="calendar"
          name="unavailable"
          label="Availability"
        />
        <q-tab
          name="settings"
          :label="!calendar ? 'Create Calendar' : 'Details'"
        />
      </q-tabs>
      <q-separator />
      <q-tab-panels
        class="nostr-card"
        v-model="tab"
        animated
      >
        <q-tab-panel
          name="appointments"
          class="q-pa-none"
        >
          <q-card-section class="appointments">
            <div class="calendar">
              <q-date
                class="full-width"
                v-model="date"
                minimal
                dark
                flat
                range
                color="secondary"
                :options="availableDaysFn"
                :events="appointmentsFn"
                @navigation="handleNavigation"
                @range-end="handleAppointmentFilter"
              />
              <div v-if="appointmentsRangeFilter">
                <small class="text-grey-4"
                  >Filter from
                  {{
                    new Date(
                      appointmentsRangeFilter.from.year,
                      appointmentsRangeFilter.from.month - 1,
                      appointmentsRangeFilter.from.day
                    ).toDateString()
                  }}
                  to
                  {{
                    new Date(
                      appointmentsRangeFilter.to.year,
                      appointmentsRangeFilter.to.month - 1,
                      appointmentsRangeFilter.to.day
                    ).toDateString()
                  }}</small
                >
              </div>
              <q-btn
                v-if="appointmentsRangeFilter"
                rounded
                @click="resetAppointmentFilter"
                label="Reset Filter"
                color="secondary"
                text-color="primary"
                class="text-capitalize q-mt-md"
              />
            </div>
            <div class="appointments--items">
              <div class="flex justify-between">
                <div class="q-mb-lg q-ml-md text-h6">
                  Appointments ({{ filteredAppointments.length }})
                </div>
                <q-input
                  v-model="searchStr"
                  dark
                  dense
                  rounded
                  standout
                  label="Search"
                  placeholder="Search for an appointment"
                  @keydown.escape="searchStr = ''"
                  ><template v-slot:append>
                    <q-icon
                      v-if="searchStr !== ''"
                      name="close"
                      @click="searchStr = ''"
                      class="cursor-pointer"
                    />
                    <q-icon
                      v-else
                      name="search"
                    /> </template
                ></q-input>
              </div>
              <q-scroll-area class="scroll-height">
                <q-list>
                  <template
                    v-for="event in filteredAppointments"
                    :key="event.id"
                  >
                    <EventItem
                      :event="event"
                      :edit="editAppointmentDialog"
                      :delete="deleteAppointment"
                    />
                  </template>
                </q-list>
              </q-scroll-area>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              round
              @click="fullcalendar = true"
              color="secondary"
              text-color="primary"
              icon="open_in_full"
            />
            <q-btn
              round
              @click="handleShare"
              color="secondary"
              text-color="primary"
              icon="share"
            />
          </q-card-actions>
        </q-tab-panel>
        <q-tab-panel
          name="unavailable"
          class="q-pa-none"
        >
          <q-card-section class="appointments">
            <div class="calendar">
              <q-date
                class="full-width"
                v-model="unavailableRange"
                minimal
                range
                dark
                flat
                color="accent"
                :options="availableDaysFn"
                :events="appointmentsFn"
                @navigation="handleNavigation"
                @range-start="handleRangeStart"
                @range-end="handleRangeEnd"
              />
              <q-card-actions
                class="q-mt-lg"
                v-if="unavailableRangeIsSet"
              >
                <q-input
                  class="full-width q-mb-md"
                  dark
                  standout
                  v-model="unavailableName"
                  type="text"
                  label="Add an optional label"
                />
                <q-btn
                  @click="createUnavailable"
                  rounded
                  class="text-capitalize"
                  color="secondary"
                  text-color="primary"
                  label="Create Unavailable"
                />
              </q-card-actions>
            </div>
            <div class="appointments--items">
              <div class="flex justify-between">
                <div class="q-mb-lg q-ml-md text-h6">Availability</div>
                <q-input
                  v-model="searchStrUn"
                  dark
                  dense
                  rounded
                  standout
                  label="Search"
                  placeholder="Search..."
                  @keydown.escape="searchStrUn = ''"
                  ><template v-slot:append>
                    <q-icon
                      v-if="searchStrUn !== ''"
                      name="close"
                      @click="searchStrUn = ''"
                      class="cursor-pointer"
                    />
                    <q-icon
                      v-else
                      name="search"
                    /> </template
                ></q-input>
              </div>
              <q-scroll-area class="scroll-height">
                <q-list>
                  <template
                    v-for="event in filteredUnavailable"
                    :key="event.id"
                  >
                    <AvailabilityItem
                      :event="event"
                      :delete="deleteUnavailable"
                    />
                  </template>
                </q-list>
              </q-scroll-area>
            </div>
          </q-card-section>
        </q-tab-panel>
        <q-tab-panel
          name="settings"
          class="q-pa-none"
        >
          <CreateEditCalendar :calendar="calendar" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-dialog
      v-model="showDialog"
      :backdrop-filter="'blur(4px) saturate(150%)'"
    >
      <q-card
        style="width: 350px"
        class="q-pa-md text-center"
      >
        <q-card-section>
          <p class="caption">Reschedule appointment</p>
          <div
            class="q-pa-md"
            style="max-width: 300px"
          >
            <q-input
              filled
              v-model="dialogData.newDate"
            >
              <template v-slot:prepend>
                <q-icon
                  name="event"
                  class="cursor-pointer"
                >
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="dialogData.newDate"
                      mask="YYYY/MM/DD HH:mm"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon
                  name="access_time"
                  class="cursor-pointer"
                >
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="dialogData.newDate"
                      mask="YYYY/MM/DD HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mt-md">
            <q-btn
              v-if="showDialog"
              rounded
              unelevated
              text-color="primary"
              color="secondary"
              @click="editAppointment"
              label="Reschedule"
              class="text-capitalize"
              :disable="dialogData.newDate === dialogData.start_time"
            ></q-btn>
            <q-btn
              rounded
              @click="resetAppointmentDialog"
              flat
              color="grey"
              class="q-ml-auto text-capitalize"
              label="Close"
            ></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import {computed, ref, onMounted} from 'vue'
import {api} from 'src/boot/axios'
import {useCalendarStore} from 'src/stores/calendar'
import {useRoute} from 'vue-router'
import {useQuasar, copyToClipboard} from 'quasar'
import {extractUnavailableDates, addMinutes, formatDate} from 'src/utils/date'

import CreateEditCalendar from 'src/components/CreateEditCalendar.vue'
import EventItem from 'src/components/EventItem.vue'
import AvailabilityItem from 'src/components/AvailabilityItem.vue'
import FullCalendar from 'src/components/FullCalendar.vue'

const $cal = useCalendarStore()
const $route = useRoute()
const $q = useQuasar()

const filterRange = ref({
  year: $cal.today.getFullYear(),
  month: $cal.today.getMonth()
})

const calendar = $cal.calendars.find(c => c.id === $route.params.id)
const tab = ref('appointments')
const date = ref($cal.getDateStr)
const fullcalendar = ref(false)

// APPOINTMENTS
//const appointments = ref([])
const appointmentsDates = ref([])
const searchStr = ref('')
const appointmentsRangeFilter = ref(null)
const showDialog = ref(false)
const dialogData = ref(null)

const filteredAppointments = computed(() => {
  let appointments = $cal.appointments.get(calendar.id) || []
  if (appointmentsRangeFilter.value) {
    const {from, to} = appointmentsRangeFilter.value
    if (from && to) {
      appointments = appointments.filter(a => {
        return (
          new Date(a.start_time) >=
            new Date(from.year, from.month - 1, from.day) &&
          new Date(a.start_time) <= new Date(to.year, to.month - 1, to.day)
        )
      })
    }
  }
  if (searchStr.value.length > 2) {
    return appointments.filter(a => {
      return (
        a.name.toLowerCase().includes(searchStr.value.toLowerCase()) ||
        a.info.toLowerCase().includes(searchStr.value.toLowerCase())
      )
    })
  }
  return appointments.filter(a => {
    return (
      new Date(a.start_time).getFullYear() === filterRange.value.year &&
      new Date(a.start_time).getMonth() + 1 === filterRange.value.month
    )
  })
})

const editAppointmentDialog = id => {
  const appointment = $cal.appointments.get(calendar.id).find(a => a.id === id)
  showDialog.value = true
  dialogData.value = {
    ...appointment,
    newDate: appointment.start_time
  }
  console.log(dialogData.value)
}

const resetAppointmentDialog = () => {
  showDialog.value = false
  dialogData.value = null
}

async function editAppointment() {
  const appointment = dialogData.value
  appointment.start_time = appointment.newDate
  const newTime = addMinutes(
    appointment.start_time.split(' ')[1],
    calendar.timeslot
  )
  appointment.end_time = `${appointment.start_time.split(' ')[0]} ${newTime}`
  try {
    const {data} = await api.put(
      `/lncalendar/api/v1/appointment/${appointment.id}`,
      {
        start_time: appointment.start_time,
        end_time: appointment.end_time
      }
    )
    $cal.updateAppointment(calendar.id, data)
    // TODO: Nostr notification
    $q.notify({
      message: 'Appointment rescheduled!',
      color: 'positive',
      icon: 'done'
    })
  } catch (error) {
    console.error(error)
    $q.notify({
      message: 'Failed to reschedule appointment!',
      color: 'negative',
      icon: 'warning'
    })
  } finally {
    resetAppointmentDialog()
  }
}

// UNAVAILABLE
// const unavailable = ref([])
const unavailableDates = ref(new Set())
const searchStrUn = ref('')

const unavailableRange = ref(null)
const unavailableRangeIsSet = ref(false)
const unavailableName = ref('')

const filteredUnavailable = computed(() => {
  const unavailable = $cal.unavailable.get(calendar.id) || []
  if (searchStrUn.value.length > 2) {
    return unavailable.filter(a => {
      return a.name.toLowerCase().includes(searchStrUn.value.toLowerCase())
    })
  }
  return unavailable.filter(a => {
    return (
      new Date(a.start_time).getFullYear() === filterRange.value.year &&
      new Date(a.start_time).getMonth() + 1 === filterRange.value.month
    )
  })
})

const availableDaysFn = date => {
  if (new Date(date).toDateString() == $cal.today.toDateString()) return true
  if (new Date(date) < $cal.today) return false
  let weekday = new Date(date).getDay()
  return calendar.available_days.some(d => d === weekday) && unavailableFn(date)
}

async function getAppointments(id) {
  try {
    await api.get(`/lncalendar/api/v1/appointment/purge/${id}`)
    const {data} = await api.get(`/lncalendar/api/v1/appointment/${id}`)
    console.log(data)
    $cal.appointments.set(
      id,
      data.filter(a => a.paid)
    )
    const appointments = $cal.appointments.get(id)
    appointmentsDates.value = appointments.map(a => a.start_time.split(' ')[0])
  } catch (error) {
    console.error(error)
  }
}

async function deleteAppointment(appointmentId) {
  // TODO: Nostr notification for user
  try {
    await api.delete(`/lncalendar/api/v1/appointment/${appointmentId}`)
    $cal.deleteAppointment(calendar.id, appointmentId)
    $q.notify({
      message: 'Appointment deleted!',
      color: 'positive',
      icon: 'done'
    })
  } catch (error) {
    console.error(error)
    $q.notify({
      message: 'Failed to delete appointment!',
      color: 'negative',
      icon: 'warning'
    })
  }
}

async function getUnavailable(id) {
  try {
    const {data} = await api.get(`/lncalendar/api/v1/unavailable/${id}`)
    $cal.unavailable.set(id, data)
    unavailableDates.value = extractUnavailableDates(data)
  } catch (error) {
    console.error(error)
  }
}

async function deleteUnavailable(unavailableId) {
  try {
    await api.delete(
      `/lncalendar/api/v1/unavailable/${calendar.id}/${unavailableId}`
    )
    $cal.deleteUnavailable(calendar.id, unavailableId)
    $q.notify({
      message: 'Unavailable time range deleted!',
      color: 'positive',
      icon: 'done'
    })
  } catch (error) {
    console.error(error)
    $q.notify({
      message: 'Failed to delete unavailable time range!',
      color: 'negative',
      icon: 'warning'
    })
  }
}

async function createUnavailable() {
  try {
    let {from, to} = unavailableRange.value
    if (!from || !to) {
      from = unavailableRange.value
      to = unavailableRange.value
    }
    const {data} = await api.post(`/lncalendar/api/v1/unavailable`, {
      start_time: from,
      end_time: to,
      name: unavailableName.value.trim(),
      schedule: calendar.id
    })
    $cal.addUnavailable(calendar.id, data)
    const unavailable = $cal.unavailable.get(calendar.id)
    unavailableDates.value = extractUnavailableDates(unavailable)
    $q.notify({
      message: 'Unavailable time range set!',
      color: 'positive',
      icon: 'done'
    })
  } catch (error) {
    console.error(error)
    $q.notify({
      message: 'Failed to set unavailable time range!',
      color: 'negative',
      icon: 'warning'
    })
  } finally {
    unavailableRangeIsSet.value = false
    unavailableName.value = ''
    unavailableRange.value = null
  }
}

const unavailableFn = date => {
  return !unavailableDates.value.has(date)
}

const appointmentsFn = date => {
  return appointmentsDates.value.includes(date)
}

const handleNavigation = view => (filterRange.value = view)

const handleRangeStart = () => {
  if (unavailableRangeIsSet.value) {
    unavailableRangeIsSet.value = false
  }
}

const handleRangeEnd = () => {
  unavailableRangeIsSet.value = true
}

const handleAppointmentFilter = range => {
  appointmentsRangeFilter.value = range
}

const resetAppointmentFilter = () => {
  appointmentsRangeFilter.value = null
  date.value = $cal.getDateStr
}

const handleShare = async () => {
  const url = `${window.location.origin}/${calendar.id}`
  const data = {
    title: 'Nostr Calendar',
    text: 'Check out my calendar!',
    url
  }
  try {
    await navigator.share(data)
  } catch (error) {
    console.debug('Error:', error)
    copyToClipboard(url)
    $q.notify({
      message: 'Link copied to clipboard!',
      color: 'positive',
      icon: 'done'
    })
  }
}

onMounted(async () => {
  const id = $route.params.id
  await getAppointments(id)
  await getUnavailable(id)
  handleNavigation({
    year: $cal.today.getFullYear(),
    month: $cal.today.getMonth() + 1
  })
})
</script>

<style scoped lang="scss">
.calendar {
  max-width: 300px;
  margin: 1.5rem auto;
  transition: all 0.22s ease-in-out;
}
.appointments {
  &--items {
  }
}

.scroll-height {
  height: 50vh;
}

.q-item__label--caption {
  color: white;
}

@media screen and (min-width: $breakpoint-sm-max) {
  .calendar {
    margin-top: 0;
  }
  .appointments {
    display: grid;
    grid-template-columns: auto 1fr;
  }
}

.dashbar {
  display: block;

  &--btn {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }
}

// full
.full-calendar {
  min-height: inherit;
}

@media screen and (min-width: $breakpoint-sm-max) {
  .dashbar {
    display: flex;
    justify-content: space-between;

    &--btn {
      margin-bottom: 0;
    }
  }
}
</style>
