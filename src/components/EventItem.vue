<template>
  <q-item dark>
    <q-item-section>
      <q-item-label overline>{{ event.name }}</q-item-label>
      <q-item-label lines="2">{{ event.info }}</q-item-label>
      <q-item-label
        caption
        class="q-mb-sm"
        >{{ timeSlotString() }}</q-item-label
      >
      <q-item-label caption>Booked {{ booked }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="flex flex-center">
        <div class="text-right q-mr-md">
          <q-item-label class="text-white">{{ scheduled }}</q-item-label>
          <q-item-label caption>{{
            event.start_time.split(' ')[0]
          }}</q-item-label>
        </div>
        <q-btn
          flat
          round
          icon="more_vert"
          color="secondary"
        >
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item
                clickable
                v-close-popup
                disable
              >
                <q-item-section>Contact</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                disable
              >
                <q-item-section>Edit</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="editEvent"
              >
                <q-item-section>Reschedule</q-item-section>
              </q-item>
              <q-separator />
              <q-item
                clickable
                v-close-popup
                class="text-negative text-weight-bold"
                @click="deleteEvent"
              >
                <q-item-section>Delete</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>
  <q-separator
    spaced
    inset
    color="secondary"
  />
</template>
<script setup>
import {timeFromNow} from 'src/utils/date'

const props = defineProps(['event', 'edit', 'delete'])

const scheduled = timeFromNow(props.event.start_time)
const booked = timeFromNow(props.event.created_at)

const deleteEvent = () => {
  props.delete(props.event.id)
}

const editEvent = () => {
  props.edit(props.event.id)
}

const timeSlotString = () => {
  const start = props.event.start_time
  const end = props.event.end_time
  const timeslot = (new Date(end) - new Date(start)) / 60000
  const timeStr = timeslot > 60 ? `${timeslot / 60} hours` : `${timeslot} min.`
  return `${timeStr} at ${start.split(' ')[1]}`
}
</script>
