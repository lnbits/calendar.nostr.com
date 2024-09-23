<template>
  <q-item dark>
    <q-item-section>
      <q-item-label overline>{{ event.name }}</q-item-label>
      <q-item-label lines="2">{{ event.info }}</q-item-label>
      <q-item-label caption>Booked {{ booked }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="flex flex-center">
        <q-item-label class="text-white q-mr-md">{{ scheduled }}</q-item-label>
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
              >
                <q-item-section>Contact</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
              >
                <q-item-section>Edit</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
              >
                <q-item-section>Reschedule</q-item-section>
              </q-item>
              <q-separator />
              <q-item
                clickable
                v-close-popup
                class="text-negative text-weight-bold"
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
const props = defineProps(['event'])
const event = props.event

const scheduled = timeFromNow(event.start_time)
const booked = timeFromNow(event.time * 1000)
</script>
