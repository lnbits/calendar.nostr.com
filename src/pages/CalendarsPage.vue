<template>
  <q-page class="q-pa-md container">
    <q-card
      v-if="isCreating"
      class="nostr-card text-white no-shadow q-my-xl"
      bordered
    >
      <CreateEditCalendar
        :name="newCalendarName"
        :cancel="cancelCreating"
      />
    </q-card>
    <div
      v-else
      class="id-card row q-mt-md"
    >
      <div
        v-for="calendar in $cal.calendars"
        :key="calendar.id"
        class="q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-3"
      >
        <CardCalendar
          :id="calendar.id"
          :name="calendar.name"
        />
      </div>
      <div class="q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <q-card
          class="nostr-card no-shadow cursor-pointer"
          bordered
        >
          <q-card-section class="text-center">
            <q-avatar
              size="150px"
              color="secondary"
              text-color="primary"
              icon="calendar_month"
            />
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="newCalendarName"
              @keydown.enter="isCreating = true"
              dark
              standout
              label="New Calendar"
              class="q-mb-xs"
            >
              <q-btn
                @click="isCreating = true"
                dense
                flat
                icon="add"
              ></q-btn>
              <template v-slot:after> </template>
            </q-input>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {ref} from 'vue'
import {useCalendarStore} from 'src/stores/calendar'

import CardCalendar from 'src/components/CardCalendar.vue'
import CreateEditCalendar from 'src/components/CreateEditCalendar.vue'

const $cal = useCalendarStore()

const newCalendarName = ref('')

const isCreating = ref(false)

const cancelCreating = () => {
  newCalendarName.value = ''
  isCreating.value = false
}
</script>

<style scoped lang="scss">
.id-card a {
  text-decoration: none;
}
</style>
