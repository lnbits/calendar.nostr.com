<template>
  <q-item dark>
    <q-item-section>
      <q-item-label overline>{{ event.name || 'Unavailable' }}</q-item-label>
      <q-item-label>{{ displayDate() }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="flex flex-center">
        <q-item-label class="text-white q-mr-md">{{
          numberOfDays() > 1 ? `${numberOfDays()} days` : `1 day`
        }}</q-item-label>
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
                <q-item-section>Edit</q-item-section>
              </q-item>

              <q-separator />
              <q-item
                clickable
                v-close-popup
                class="text-negative text-weight-bold"
                @click="deleteUnavailable"
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
const props = defineProps(['event', 'delete'])

const displayDate = () => {
  if (props.event.start_time == props.event.end_time) {
    return `Unavailable on ${props.event.start_time}`
  } else {
    return `Unavailable from ${props.event.start_time} to ${props.event.end_time}`
  }
}

const numberOfDays = () => {
  const start = new Date(props.event.start_time)
  const end = new Date(props.event.end_time)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1)
  return diffDays
}

const deleteUnavailable = () => {
  props.delete(props.event.id)
}
</script>
