<template>
  <q-page class="q-pa-md container">
    <q-card
      class="nostr-card text-white no-shadow q-mt-xl"
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
          label="Unavailable"
        />
        <q-tab
          name="settings"
          :label="!calendar ? 'Create Calendar' : 'Edit Calendar'"
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
              />
            </div>
            <div class="appointments--items">
              <div class="q-mb-lg q-ml-md text-h6">Appointments</div>
              <q-scroll-area class="scroll-height">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Single line item</q-item-label>
                      <q-item-label
                        caption
                        lines="2"
                        >Secondary line text. Lorem ipsum dolor sit amet,
                        consectetur adipiscit elit.</q-item-label
                      >
                    </q-item-section>

                    <q-item-section
                      side
                      top
                    >
                      <q-item-label caption>5 min ago</q-item-label>
                      <q-icon
                        name="star"
                        color="yellow"
                      />
                    </q-item-section>
                  </q-item>

                  <q-separator
                    spaced
                    inset
                    color="secondary"
                  />

                  <q-item>
                    <q-item-section>
                      <q-item-label>Single line item</q-item-label>
                      <q-item-label
                        caption
                        lines="2"
                        >Secondary line text. Lorem ipsum dolor sit amet,
                        consectetur adipiscit elit.</q-item-label
                      >
                    </q-item-section>

                    <q-item-section
                      side
                      top
                    >
                      <q-item-label caption>5 min ago</q-item-label>
                      <q-icon
                        name="star"
                        color="yellow"
                      />
                    </q-item-section>
                  </q-item>

                  <q-separator
                    spaced
                    inset
                    color="secondary"
                  />
                  <q-item>
                    <q-item-section>
                      <q-item-label>Single line item</q-item-label>
                      <q-item-label
                        caption
                        lines="2"
                        >Secondary line text. Lorem ipsum dolor sit amet,
                        consectetur adipiscit elit.</q-item-label
                      >
                    </q-item-section>

                    <q-item-section
                      side
                      top
                    >
                      <q-item-label caption>5 min ago</q-item-label>
                      <q-icon
                        name="star"
                        color="yellow"
                      />
                    </q-item-section>
                  </q-item>

                  <q-separator
                    spaced
                    inset
                    color="secondary"
                  />
                  <q-item>
                    <q-item-section>
                      <q-item-label>Single line item</q-item-label>
                      <q-item-label caption
                        >Secondary line text. Lorem ipsum dolor sit amet,
                        consectetur adipiscit elit.</q-item-label
                      >
                    </q-item-section>

                    <q-item-section
                      side
                      top
                    >
                      <q-item-label caption>Voted!</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator
                    spaced
                    inset
                    color="secondary"
                  />

                  <q-item>
                    <q-item-section>
                      <q-item-label>Single line item</q-item-label>
                      <q-item-label caption
                        >Secondary line text. Lorem ipsum dolor sit amet,
                        consectetur adipiscit elit.</q-item-label
                      >
                    </q-item-section>

                    <q-item-section
                      side
                      top
                    >
                      <q-badge
                        color="teal"
                        label="10k"
                      />
                    </q-item-section>
                  </q-item>

                  <q-separator
                    spaced
                    inset
                    color="secondary"
                  />

                  <q-item>
                    <q-item-section>
                      <q-item-label>Single line item</q-item-label>
                      <q-item-label caption
                        >Secondary line text. Lorem ipsum dolor sit amet,
                        consectetur adipiscit elit.</q-item-label
                      >
                    </q-item-section>

                    <q-item-section
                      side
                      top
                    >
                      <q-item-label caption>2 min ago</q-item-label>
                      <div class="text-orange">
                        <q-icon name="star" />
                        <q-icon name="star" />
                        <q-icon name="star" />
                      </div>
                    </q-item-section>
                  </q-item>

                  <q-separator
                    spaced
                    inset
                    color="secondary"
                  />

                  <q-item>
                    <q-item-section>
                      <q-item-label>Single line item</q-item-label>
                      <q-item-label caption
                        >Secondary line text. Lorem ipsum dolor sit amet,
                        consectetur adipiscit elit.</q-item-label
                      >
                    </q-item-section>

                    <q-item-section
                      side
                      top
                    >
                      <q-item-label caption>meta</q-item-label>
                    </q-item-section>
                  </q-item>
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
                v-model="date"
                minimal
                range
                dark
                flat
                color="accent"
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
              <div class="q-mb-lg q-ml-md text-h6">Unavailable Dates</div>
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
          <q-card-section v-if="$cal.calendars.length == 0">
            <div class="text-h6">Create a calendar</div>
            <div class="text-subtitle2">
              Create a calendar to start acceptin appointments
            </div>
          </q-card-section>
          <q-card-section>
            <q-select
              class="q-mb-lg"
              color="secondary"
              standout
              dark
              map-options
              hint="Funds will be sent to this wallet"
              label="Select Wallet"
              v-model="calendar_data.wallet"
              :options="userWallets"
            ></q-select>
            <q-input
              dark
              standout
              class="q-mb-lg"
              v-model.trim="calendar_data.name"
              type="name"
              label="Your calendar name"
            ></q-input>
            <small>Time per appointment</small>
            <q-slider
              class="q-px-md q-mt-sm q-mb-xl"
              v-model="calendar_data.timeslot"
              color="secondary"
              dark
              markers
              :step="30"
              snap
              :marker-labels="timeSlots"
              :min="30"
              :max="120"
            />
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
                      >
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-toggle
                            class="col-12"
                            v-model="format24h"
                            label="24h format"
                          ></q-toggle>
                          <q-btn
                            label="Cancel"
                            color="primary"
                            flat
                            v-close-popup
                          ></q-btn>
                          <q-btn
                            label="OK"
                            color="primary"
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
                      >
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-toggle
                            class="col-12"
                            v-model="format24h"
                            label="24h format"
                          ></q-toggle>
                          <q-btn
                            label="Cancel"
                            color="primary"
                            flat
                            v-close-popup
                          ></q-btn>
                          <q-btn
                            label="OK"
                            color="primary"
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
                v-model="calendar_data.currency"
                disable
                label="Currency"
              />
              <q-input
                class="col-12 col-sm-6"
                dark
                standout
                v-model="calendar_data.amount"
                type="number"
                label="How much to charge per appointment *"
              />
            </div>
          </q-card-section>
          <q-separator color="secondary"></q-separator>

          <q-card-actions
            align="right"
            class="q-pa-md"
          >
            <q-btn
              @click="null"
              rounded
              class="text-capitalize"
              color="secondary"
              text-color="primary"
              label="Create Calendar"
            />
          </q-card-actions>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import {ref} from 'vue'
import {useCalendarStore} from 'src/stores/calendar'

const $cal = useCalendarStore()

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
  {label: '30m', value: 30},
  {label: '1 hour', value: 60},
  {label: '2 hours', value: 120}
]

const format24h = ref(true)
const calendar = ref(true)
const tab = ref('appointments')
const calendar_data = ref({
  wallet: '',
  name: '',
  timeslot: 30,
  start_day: 1,
  end_day: 5,
  start_time: '08:00',
  end_time: '17:00',
  currency: 'sats',
  amount: 0
})
const date = ref(new Date().toString())
const unavailableRange = ref(null)
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
