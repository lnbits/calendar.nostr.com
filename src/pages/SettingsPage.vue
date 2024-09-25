<template>
  <q-page class="q-pa-md container">
    <q-card
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
                color="secondary"
                :options="availableDaysFn"
                :events="appointmentsFn"
                @navigation="handleNavigation"
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
                    <EventItem :event="event" />
                  </template>
                </q-list>
              </q-scroll-area>
            </div>
          </q-card-section>
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
              />
              <q-card-actions class="q-mt-lg">
                <q-btn
                  @click="null"
                  rounded
                  class="text-capitalize"
                  color="secondary"
                  text-color="primary"
                  label="Set Unavailable"
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
                    <AvailabilityItem :event="event" />
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
  </q-page>
</template>

<script setup>
import {computed, ref, onMounted} from 'vue'
import {api} from 'src/boot/axios'
import {useCalendarStore} from 'src/stores/calendar'
import {useRoute} from 'vue-router'
import {extractUnavailableDates} from 'src/utils/date'

import CreateEditCalendar from 'src/components/CreateEditCalendar.vue'
import EventItem from 'src/components/EventItem.vue'
import AvailabilityItem from 'src/components/AvailabilityItem.vue'

const $cal = useCalendarStore()
const $route = useRoute()

const filterRange = ref({
  year: $cal.today.getFullYear(),
  month: $cal.today.getMonth()
})

const calendar = $cal.calendars.find(c => c.id === $route.params.id)
const tab = ref('unavailable')
const date = ref(new Date().toString())

// APPOINTMENTS
const appointments = ref([])
const appointmentsDates = ref([])
const searchStr = ref('')

const filteredAppointments = computed(() => {
  console.log(searchStr.value)
  if (searchStr.value.length > 2) {
    return appointments.value.filter(a => {
      return (
        a.name.toLowerCase().includes(searchStr.value.toLowerCase()) ||
        a.info.toLowerCase().includes(searchStr.value.toLowerCase())
      )
    })
  }
  return appointments.value.filter(a => {
    return (
      new Date(a.start_time).getFullYear() === filterRange.value.year &&
      new Date(a.start_time).getMonth() + 1 === filterRange.value.month
    )
  })
})

// UNAVAILABLE
const unavailable = ref([])
const unavailableDates = ref(new Set())
const searchStrUn = ref('')

const filteredUnavailable = computed(() => {
  if (searchStrUn.value.length > 2) {
    return unavailable.value.filter(a => {
      return a.name.toLowerCase().includes(searchStrUn.value.toLowerCase())
    })
  }
  return unavailable.value.filter(a => {
    return (
      new Date(a.start_time).getFullYear() === filterRange.value.year &&
      new Date(a.start_time).getMonth() + 1 === filterRange.value.month
    )
  })
})

const unavailableRange = ref(null)

const availableDaysFn = date => {
  if (new Date(date) < $cal.today) return false
  let weekday = new Date(date).getDay() - 1
  return calendar.available_days.some(d => d === weekday) && unavailableFn(date)
}

async function getAppointments(id) {
  try {
    const {data} = await api.get(`/lncalendar/api/v1/appointment/${id}`)
    $cal.appointments.set(id, data)
    appointments.value = $cal.appointments.get(id)
    appointmentsDates.value = data.map(a => a.start_time.split(' ')[0])
  } catch (error) {
    console.error(error)
  }
}

async function getUnavailable(id) {
  try {
    const {data} = await api.get(`/lncalendar/api/v1/unavailable/${id}`)
    $cal.unavailable.set(id, data)
    unavailable.value = $cal.unavailable.get(id)
    unavailableDates.value = extractUnavailableDates(data)
    console.log(unavailable.value)
  } catch (error) {
    console.error(error)
  }
}

const unavailableFn = date => {
  return !unavailableDates.value.has(date)
}

const appointmentsFn = date => {
  return appointmentsDates.value.includes(date)
}

const handleNavigation = view => (filterRange.value = view)

onMounted(async () => {
  const id = $route.params.id
  await getAppointments(id)
  await getUnavailable(id)
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
</style>
