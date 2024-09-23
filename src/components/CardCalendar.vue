<template>
  <router-link
    :to="{
      path: `/calendars/${props.id}`
    }"
  >
    <q-card
      id="card-calendar"
      class="nostr-card no-shadow cursor-pointer"
      bordered
    >
      <q-card-section class="text-center q-mt-sm">
        <q-avatar
          size="150px"
          color="secondary"
          text-color="primary"
          icon="calendar_month"
          class="q-my-lg"
        />
      </q-card-section>
      <q-card-section class="q-pt-none text-center text-white">
        <div class="text-h6">
          <span v-text="props.name"></span>
        </div>
      </q-card-section>
    </q-card>
  </router-link>
</template>

<script setup>
const props = defineProps(['id', 'name'])
</script>
