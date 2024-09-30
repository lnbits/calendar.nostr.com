<template>
  <q-card-section v-if="isNew">
    <div class="text-h6">Create a calendar</div>
    <div class="text-subtitle2">
      Create a calendar to start accepting appointments
    </div>
  </q-card-section>
  <q-card-section>
    <div class="row q-mb-lg q-col-gutter-md">
      <q-select
        class="col-12 col-sm-6"
        color="secondary"
        standout
        dark
        map-options
        emit-value
        hint="Funds will be sent to this wallet"
        label="Select Wallet"
        v-model="calendar_data.wallet"
        :options="$acc.wallets"
      ></q-select>
      <!-- <q-select
        class="col-12 col-sm-6"
        color="secondary"
        standout
        dark
        map-options
        hint="Nostr Identifier"
        label="Select Identifier"
        :model-value="[]"
        disabled
      ></q-select> -->
      <q-select
        class="col-12 col-sm-6"
        color="secondary"
        standout
        dark
        map-options
        emit-value
        v-model="calendar_data.timeslot"
        label="Time per appointment"
        :options="timeSlots"
        hint="Time per appointment"
      ></q-select>
    </div>
    <q-input
      dark
      standout
      class="q-mb-lg"
      v-model.trim="calendar_data.name"
      type="name"
      label="Calendar name"
    ></q-input>
    <div class="row q-mb-lg q-col-gutter-md">
      <q-select
        class="col-12 col-sm-6"
        dark
        standout
        map-options
        emit-value
        v-model="calendar_data.start_day"
        :options="weekdays"
        label="Weekday start *"
      >
      </q-select>
      <q-select
        class="col-12 col-sm-6"
        dark
        standout
        map-options
        emit-value
        v-model="calendar_data.end_day"
        :options="weekdays"
        label="Weekday end *"
      >
      </q-select>
    </div>
    <div class="row q-mb-lg q-col-gutter-md">
      <q-input
        class="col-12 col-sm-6"
        dark
        standout
        v-model="calendar_data.start_time"
        type="time"
        label="Time start *"
        ><template v-slot:after>
          <q-icon
            round
            dense
            flat
            name="schedule"
            class="cursor-pointer"
            ><q-popup-proxy
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time
                v-model="calendar_data.start_time"
                :format24h="format24h"
                dark
                color="secondary"
              >
                <div class="row items-center justify-end q-gutter-sm">
                  <q-toggle
                    class="col-12"
                    v-model="format24h"
                    label="24h format"
                    color="secondary"
                  ></q-toggle>
                  <q-btn
                    rounded
                    label="Cancel"
                    color="secondary"
                    flat
                    v-close-popup
                  ></q-btn>
                  <q-btn
                    rounded
                    label="OK"
                    color="secondary"
                    flat
                    v-close-popup
                  ></q-btn>
                </div>
              </q-time> </q-popup-proxy
          ></q-icon> </template
      ></q-input>
      <q-input
        class="col-12 col-sm-6"
        dark
        standout
        v-model="calendar_data.end_time"
        type="time"
        label="Time end *"
        ><template v-slot:after>
          <q-icon
            round
            dense
            flat
            name="schedule"
            class="cursor-pointer"
            ><q-popup-proxy
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time
                v-model="calendar_data.end_time"
                :format24h="format24h"
                dark
                color="secondary"
              >
                <div class="row items-center justify-end q-gutter-sm">
                  <q-toggle
                    class="col-12"
                    v-model="format24h"
                    label="24h format"
                    color="secondary"
                  ></q-toggle>
                  <q-btn
                    label="Cancel"
                    color="secondary"
                    flat
                    v-close-popup
                  ></q-btn>
                  <q-btn
                    label="OK"
                    color="secondary"
                    flat
                    v-close-popup
                  ></q-btn>
                </div>
              </q-time> </q-popup-proxy
          ></q-icon> </template
      ></q-input>
    </div>
    <div class="row q-mb-lg q-col-gutter-md">
      <q-input
        class="col-12 col-sm-6"
        dark
        standout
        v-model="calendar_data.amount"
        type="number"
        label="How much to charge per appointment *"
      />
      <q-input
        class="col-12 col-sm-6"
        dark
        standout
        v-model="calendar_data.currency"
        disable
        label="Currency"
      />
    </div>
  </q-card-section>
  <q-separator color="secondary"></q-separator>

  <q-card-actions
    align="right"
    class="q-pa-md"
  >
    <q-btn
      @click="handleCancel"
      rounded
      class="text-capitalize float-left q-mr-auto"
      flat
      color="secondary"
      :label="isNew ? 'Cancel' : 'Reset'"
      :disable="!isNew && !hasChanged()"
    />
    <q-btn
      @click="handleCalendar"
      :disable="
        isNew
          ? !calendar_data.wallet ||
            !calendar_data.name ||
            !calendar_data.start_day ||
            !calendar_data.end_day ||
            !calendar_data.start_time ||
            !calendar_data.end_time ||
            !calendar_data.amount
          : !hasChanged()
      "
      rounded
      class="text-capitalize"
      color="secondary"
      text-color="primary"
      :label="isNew ? 'Create Calendar' : 'Update Calendar'"
    />
  </q-card-actions>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {api} from 'boot/axios'
import {useQuasar} from 'quasar'
import {useCalendarStore} from 'src/stores/calendar'
import {useAccountStore} from 'src/stores/account'

const props = defineProps(['name', 'cancel', 'calendar'])

const $cal = useCalendarStore()
const $acc = useAccountStore()
const $q = useQuasar()

const weekdays = [
  {label: 'Sunday', value: 0},
  {label: 'Monday', value: 1},
  {label: 'Tuesday', value: 2},
  {label: 'Wednesday', value: 3},
  {label: 'Thursday', value: 4},
  {label: 'Friday', value: 5},
  {label: 'Saturday', value: 6}
]

const timeSlots = [
  {label: '15 minutes', value: 15},
  {label: '30 minutes', value: 30},
  {label: '45 minutes', value: 45},
  {label: '1 hour', value: 60},
  {label: '1.5 hours', value: 90},
  {label: '2 hours', value: 120},
  {label: '3 hours', value: 180},
  {label: '4 hours', value: 240}
]

const isNew = ref(true)
const format24h = ref(true)
const calendar_data = ref({
  wallet: $acc.wallets[0].value,
  name: props.name,
  timeslot: 30,
  start_day: 1,
  end_day: 5,
  start_time: '08:00',
  end_time: '17:00',
  currency: 'sats',
  amount: null,
  timeslot: 30
})

let originalData = {...props.calendar} || {}

const hasChanged = () => {
  return (
    !isNew.value &&
    JSON.stringify(calendar_data.value) !== JSON.stringify(originalData)
  )
}

function handleCalendar() {
  if (isNew.value) {
    createCalendar()
  } else {
    updateCalendar()
  }
}

function handleCancel() {
  if (isNew.value) {
    props.cancel()
  } else {
    calendar_data.value = {...originalData}
  }
}

async function updateCalendar() {
  try {
    const {data} = await api.put(
      `/lncalendar/api/v1/schedule/${props.calendar.id}`,
      calendar_data.value
    )
    $cal.updateCalendar(data)
    $q.notify({
      message: 'Calendar created!',
      color: 'positive'
    })
    calendar_data.value = {...$cal.getCalendar(data.id)}
    originalData = {...data}
  } catch (error) {
    $q.notify({
      message: 'Failed to update calendars!',
      color: 'negative',
      icon: 'warning'
    })
  }
}

async function createCalendar() {
  try {
    const {data} = await api.post(
      '/lncalendar/api/v1/schedule',
      calendar_data.value
    )
    $cal.addCalendar(data)
    $q.notify({
      message: 'Calendar created!',
      color: 'positive'
    })
  } catch (error) {
    $q.notify({
      message: 'Failed to create calendars!',
      color: 'negative',
      icon: 'warning'
    })
  } finally {
    props.cancel()
  }
}

onMounted(() => {
  if (props.calendar) {
    isNew.value = false
    calendar_data.value = props.calendar
  }
})
</script>
