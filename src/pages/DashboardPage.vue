<template>
  <q-page class="q-pa-md">
    <div class="container q-py-md dashbar">
      <div class="dashbar--btn">
        <q-btn-toggle
          class="dashbar--btn"
          round
          v-model="$cal.view"
          @update="updateView(val)"
          toggle-text-color="primary"
          toggle-color="secondary"
          text-color="secondary"
          :options="[
            {label: 'Day', value: 'day'},
            {label: 'Week', value: 'week'},
            {label: 'Month', value: 'month'},
            {label: 'Year', value: 'year'}
          ]"
        />
      </div>
      <q-input
        dark
        standout
        rounded
        v-model.trim="search"
        class="input"
        label-color="blue-grey-4"
        @keydown.enter.prevent="handleSearch"
      >
        <template v-slot:append>
          <q-btn
            rounded
            unelevated
            text-color="primary"
            color="secondary"
            label="Search"
            @click="handleSearch"
            class="text-capitalize"
          />
        </template>
      </q-input>
    </div>
    <div class="calendar">
      <vue-cal
        :selected-date="$cal.date"
        :activeView="$cal.view"
        :events="events"
        hideViewSelector
        @view-change="val => $cal.setView(val.view)"
        @event-click="val => console.log(val)"
      ></vue-cal>
    </div>
  </q-page>
</template>

<script setup>
import {ref} from 'vue'
import VueCal from 'vue-cal'
import {useCalendarStore} from 'src/stores/calendar'

const $cal = useCalendarStore()

const search = ref('')

const events = [
  {
    start: '2024-09-19 10:30',
    end: '2024-09-19 11:00',
    title: 'Doctor appointment'
  },
  {
    start: '2024-09-19 12:00',
    end: '2024-09-19 13:00',
    title: 'Lunch'
  },
  {
    start: '2024-09-19 14:00',
    end: '2024-09-19 15:00',
    title: 'Meeting'
  },
  {
    start: '2024-09-19 16:00',
    end: '2024-09-19 17:00',
    title: 'Workout'
  }
]

const updateView = val => {
  $acc.setView(val)
}

const handleSearch = async () => {
  if (!handle.value) {
    return
  }
}
</script>

<style lang="scss">
.dashbar {
  display: block;

  &--btn {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }
}

.calendar {
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
