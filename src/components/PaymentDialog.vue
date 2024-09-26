<template>
  <q-dialog
    v-model="dataDialog"
    :backdrop-filter="'blur(4px) saturate(150%)'"
  >
    <q-card
      style="width: 350px"
      class="q-pa-md text-center"
    >
      <q-card-section v-if="paymentDetails?.payment_request">
        <p class="caption">
          Scan the QR code below using a lightning wallet to secure your Nostr
          identity.
        </p>
        <div class="text-h6">
          <span v-text="paymentDetails.local_part"></span>
        </div>
        <div class="responsive">
          <a :href="'lightning:' + paymentDetails.payment_request">
            <vue-qrcode
              :value="paymentDetails.payment_request"
              :options="{width: 500}"
            ></vue-qrcode>
          </a>
        </div>
      </q-card-section>
      <q-card-section>
        <q-linear-progress
          indeterminate
          color="secondary"
          class="q-mt-sm"
        />
        <div class="row q-mt-md">
          <q-btn
            v-if="paymentDetails?.payment_request"
            rounded
            unelevated
            text-color="primary"
            color="secondary"
            @click="copyData(paymentDetails.payment_request)"
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
import VueQrcode from '@chenfengyuan/vue-qrcode'

const props = defineProps([
  'dialog',
  'paymentDetails',
  'resetDataDialog',
  'copyData'
])
console.log(props)

const dataDialog = ref(props.dialog)
</script>
