<template>
  <q-dialog
    :model-value="show"
    :backdrop-filter="'blur(4px) saturate(150%)'"
  >
    <q-card
      style="max-width: 450px"
      class="q-pa-md text-center"
    >
      <q-card-section>
        <p class="caption">Reschedule appointment</p>
        <div class="row">
          <q-input
            v-model="date"
            outlined
            dense
            label="Date"
            type="date"
            class="col-12"
          ></q-input>
          <q-input
            v-model="time"
            outlined
            dense
            label="Time"
            type="time"
            class="col-12"
          ></q-input>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-mt-md">
          <q-btn
            v-if="paymentDetails?.payment_request"
            rounded
            unelevated
            text-color="primary"
            color="secondary"
            @click="handleUpdate"
            label="Copy Invoice"
            class="text-capitalize"
          ></q-btn>
          <q-btn
            @click="resetDataDialog"
            flat
            color="grey"
            class="q-ml-auto text-capitalize"
            label="Close"
          ></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref} from 'vue'

const props = defineProps(['show', 'data', 'update', 'close'])

const date = ref('')
const time = ref('')

const editedData = ref({...props.data})

const handleUpdate = () => {
  props.update(editedData.value)
  props.close()
}
</script>
