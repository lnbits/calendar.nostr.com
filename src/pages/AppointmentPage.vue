<template>
  <div class="bg-image flex flex-center">
    <BgSvg />
    <div
      class="flex-center container"
      v-if="loaded"
    >
      <q-card
        class="nostr-card text-white no-shadow q-mb-xl nostr-card--appointment"
        bordered
      >
        <q-card-section class="appointment--1">
          <div
            v-if="isConfirming"
            class="text-left"
          >
            <q-btn
              round
              outline
              color="secondary"
              icon="arrow_back"
              @click="toggleConfirm"
            />
          </div>
          <div class="q-my-lg">
            <div class="text-h6">{{ calendar.name }}</div>
            <div class="text-subtitle2">
              Please follow the instructions to add an appointment to my
              schedule
            </div>
          </div>
          <p v-if="isConfirming">Appointment at {{ timeSlot }} on {{ date }}</p>
        </q-card-section>
        <q-card-section
          class="q-pa-lg"
          v-if="isConfirming"
        >
          <div class="text-h6 q-mb-xl">Enter details</div>
          <div class="details q-mb-xl">
            <q-input
              dark
              standout
              class="q-mb-lg"
              v-model.trim="userData.name"
              type="name"
              label="Your name "
            ></q-input>
            <q-input
              dark
              standout
              class="q-mb-lg"
              v-model.trim="userData.nostr"
              type="text"
              label="Your Nostr identifier/npub (optional, if you want a reply)"
            ></q-input>
            <q-input
              dark
              standout
              class="q-mb-lg"
              v-model.trim="userData.email"
              type="email"
              label="Your email (optional, if you want a reply)"
            ></q-input>
            <q-input
              dark
              standout
              class="q-mb-lg"
              v-model="userData.text"
              type="textarea"
              label="Write a message (optional)"
            ></q-input>
            <small>Some legal giberish, maybe?!</small>
          </div>
          <div>
            <q-btn
              rounded
              class="text-capitalize"
              color="secondary"
              text-color="primary"
              label="Schedule"
              @click="toggleConfirm"
            />
          </div>
        </q-card-section>
        <q-card-section v-else>
          <div class="appointment--2">
            <div class="text-h6 text-center q-mb-xl">Select a Date & Time</div>
            <div class="timeslot">
              <div class="date q-mb-lg">
                <q-date
                  v-model="date"
                  dark
                  flat
                  class="full-width"
                  color="secondary"
                  text-color="primary"
                  minimal
                  :options="availableDaysFn"
                />
              </div>
              <div class="slot scroll">
                <div
                  v-for="(slot, i) in timeSlots"
                  :key="i"
                  class="q-mb-sm"
                >
                  <q-btn-group spread>
                    <q-btn
                      :color="timeSlot == slot ? 'secondary' : 'primary'"
                      :label="slot"
                      icon="access_time"
                      @click="toggleSlot(slot)"
                      padding="md"
                      :disable="unavailableSlot(slot)"
                    />
                    <q-btn
                      v-if="timeSlot == slot"
                      color="primary"
                      label="Book"
                      class="q-ml-sm"
                      @click="createAppointment"
                    />
                  </q-btn-group>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div
      class="flex-center"
      v-else
    >
      <q-spinner-gears
        color="secondary"
        size="100px"
      />
    </div>
  </div>
</template>

<script setup>
import {computed, ref, onMounted} from 'vue'
import {api} from 'src/boot/axios'
import {useRoute} from 'vue-router'
import BgSvg from 'src/components/BgSvg.vue'
import {extractUnavailableDates, timeslotsByInterval} from 'src/utils/date'

const $route = useRoute()
const loaded = ref(false)
const today = new Date()

const date = ref(today.toDateString())
const calendar = ref({})
const title = ref('')
const timeSlots = ref([])
const timeSlot = ref(null)
const isConfirming = ref(false)
const userData = ref({})

const appointments = ref([])
const unavailableDates = ref(new Set())

const filteredAppointments = computed(() => {
  console.log('filteredAppointments')
  return appointments.value.filter(
    a =>
      new Date(a.start_time).toDateString() ===
      new Date(date.value).toDateString()
  )
})

const toggleSlot = slot => {
  timeSlot.value = timeSlot.value === slot ? null : slot
}

const toggleConfirm = () => {
  isConfirming.value = !isConfirming.value
}

function timeSlotsFn() {
  const start = calendar.value.start_time
  const end = calendar.value.end_time
  const timeInterval = calendar.value.timeslots
  const timeslots = timeslotsByInterval(start, end, timeInterval)

  return timeslots
}

const unavailableFn = date => {
  return !unavailableDates.value.has(date)
}

const availableDaysFn = date => {
  if (!calendar.value.available_days) return false
  if (new Date(date) < new Date()) return false
  let weekday = new Date(date).getDay() - 1
  return (
    calendar.value.available_days.some(d => d === weekday) &&
    unavailableFn(date)
  )
}

const isBooked = time => {
  return filteredAppointments.value.some(
    a => a.start_time.split(' ')[1] === time
  )
}

const unavailableSlot = time => {
  if (isBooked(time)) return true
  if (new Date(`${date.value} ${time}`) < today) return true
  return false
}

// Fetch data
async function getSchedule(calendarId) {
  try {
    const {data} = await api.get(`lncalendar/api/v1/schedule/${calendarId}`)
    title.value = data.name
    calendar.value = data
  } catch (error) {
    console.error(error)
  }
}

async function getAppointments(calendarId) {
  try {
    title
    const {data} = await api.get(`lncalendar/api/v1/appointment/${calendarId}`)
    appointments.value = data
  } catch (error) {
    console.error(error)
  }
}

async function getUnavailable(calendarId) {
  try {
    const {data} = await api.get(`/lncalendar/api/v1/unavailable/${calendarId}`)
    unavailableDates.value = new Set([
      ...unavailableDates.value,
      ...extractUnavailableDates(data)
    ])
  } catch (error) {
    console.error(error)
  }
}

// create appointment
async function createAppointment() {
  const timeslots = timeSlotsFn()
  try {
    console.log('createAppointment')
    console.log(userData.value)
    console.log(timeSlot.value)
    console.log(timeslots[timeslots.indexOf(timeSlot.value) + 1])
    // const {data} = await api.post(
    //   `/lncalendar/api/v1/appointment`,
    //   {
    //     ...userData.value,
    //     date: date.value,
    //     time: timeSlot.value
    //   }
    // )
    // appointments.value = [...appointments.value, data]
    // userData.value = {}
    // timeSlot.value = null
    // toggleConfirm()
  } catch (error) {
    console.error(error)
  }
}
onMounted(async () => {
  const calendarId = $route.params.id
  await getSchedule(calendarId)
  await getAppointments(calendarId)
  await getUnavailable(calendarId)
  timeSlots.value = timeSlotsFn().slice(0, -1)
  loaded.value = true
})
</script>

<style lang="scss">
.nostr-card--appointment {
  display: grid;
  min-height: 700px;
  max-width: 1060px;
  transition: all 0.2s ease-out;
}

.appointment--1 {
  text-align: center;
  width: 100%;
  border-bottom: 1px solid $secondary !important;
}

.appointment--2 {
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease-out;

  .timeslot {
    display: flex;
    flex-direction: column;
    transition: all 0.2s ease-out;
  }

  .date {
    width: 100%;
    height: fit-content;
    margin-right: 16px;
  }
  .slot {
    max-height: 50vh;
  }
}

@media screen and (min-width: $breakpoint-sm-max) {
  .nostr-card--appointment {
    grid-template-rows: none;
    grid-template-columns: 1fr 2fr;
  }

  .appointment--1 {
    text-align: left;
    min-width: 300px;
    border-bottom: none;
    border-right: 1px solid $secondary !important;
    border-top-right-radius: 0 !important;
    transition: all 0.2s ease-out;
  }

  .appointment--2 {
    display: flex;
    flex-direction: column;

    .timeslot {
      display: flex;
      flex-direction: row;
    }

    .date {
      width: 60%;
      height: fit-content;
      margin-right: 16px;
    }
    .slot {
      width: 40%;
      max-height: 65vh;
    }
  }

  .details {
    max-width: 400px;
  }
}
</style>
