<template>
  <div class="bg-image flex flex-center">
    <BgSvg />
    <div class="flex-center container">
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
            <div class="text-h6">Vlad Stan</div>
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
                    />
                    <q-btn
                      v-if="timeSlot == slot"
                      color="primary"
                      label="Book"
                      class="q-ml-sm"
                      @click="toggleConfirm"
                    />
                  </q-btn-group>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import BgSvg from 'src/components/BgSvg.vue'

const $route = useRoute()

const date = ref(new Date().toString())
const title = ref($route.params.id)
const timeSlots = ref(timeSlotsFn())
const timeSlot = ref(null)
const isConfirming = ref(false)
const userData = ref({})

const toggleSlot = slot => {
  timeSlot.value = timeSlot.value === slot ? null : slot
}

const toggleConfirm = () => {
  isConfirming.value = !isConfirming.value
}

function timeSlotsFn() {
  const [startHour, startMinute] = '09:00'.split(':').map(Number)
  const [endHour, endMinute] = '17:00'.split(':').map(Number)
  const slots = []

  for (
    let time = startHour * 60 + startMinute;
    time <= endHour * 60 + endMinute;
    time += 30
  ) {
    const hour = Math.floor(time / 60)
    const minute = time % 60
    slots.push(
      `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    )
  }
  return slots
}
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
