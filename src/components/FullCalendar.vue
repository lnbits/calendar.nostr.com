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
        :events="appointments"
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

const props = defineProps(['events'])

const $cal = useCalendarStore()

const search = ref('')

const appointments = props.events.map(event => {
  return {
    title: event.name,
    start: event.start_time,
    end: event.end_time
  }
})

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
