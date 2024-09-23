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
                <div class="q-mb-lg q-ml-md text-h6">Appointments</div>
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
              <div class="q-mb-lg q-ml-md text-h6">Availability</div>
              <q-list>
                <q-item
                  tag="label"
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-checkbox
                      dark
                      :model-value="false"
                      val="orange"
                      color="secondary"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Unavailable</q-item-label>
                    <q-item-label caption
                      >From 2024/10/01 to 2024/10/15</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-separator
                  spaced
                  inset
                  color="secondary"
                />
                <q-item
                  tag="label"
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-checkbox
                      dark
                      :model-value="true"
                      val="orange"
                      color="secondary"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Unavailable</q-item-label>
                    <q-item-label caption
                      >From 2024/09/07 to 2024/09/15</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
              <q-card-actions
                class="q-mt-lg"
                align="right"
              >
                <q-btn
                  @click="null"
                  rounded
                  class="text-capitalize"
                  color="secondary"
                  text-color="primary"
                  label="Delete Selected"
                />
              </q-card-actions>
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

import CreateEditCalendar from 'src/components/CreateEditCalendar.vue'
import EventItem from 'src/components/EventItem.vue'

const $cal = useCalendarStore()
const $route = useRoute()

const filterRange = ref({
  year: $cal.today.getFullYear(),
  month: $cal.today.getMonth()
})

const calendar = $cal.calendars.find(c => c.id === $route.params.id)
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
      new Date(a.start_time).getMonth() === filterRange.value.month
    )
  })
})

const tab = ref('appointments')
const date = ref(new Date().toString())
const unavailableRange = ref(null)

const availableDaysFn = date => {
  if (new Date(date) < $cal.today) return false
  let weekday = new Date(date).getDay() - 1
  return calendar.available_days.some(d => d === weekday)
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

const appointmentsFn = date => {
  return appointmentsDates.value.includes(date)
}

const handleNavigation = view => (filterRange.value = view)

onMounted(async () => {
  const id = $route.params.id
  await getAppointments(id)
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
