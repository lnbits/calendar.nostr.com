<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="container-fluid q-py-md">
        <q-toolbar-title
          class="text-h2"
          style="font-size: 1.5rem; font-weight: 700; cursor: pointer"
          @click="home"
          clickable
        >
          <b>Calendar</b>
        </q-toolbar-title>

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            class="nostr-card"
            label="myNostr"
            href="https://my.nostr.com"
            ><q-tooltip>Return to myNostr</q-tooltip></q-btn
          >
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container class="bg-image">
      <BgSvg />
      <template v-if="!$cal.initiated"> Loaging... </template>
      <template v-else>
        <router-view />
      </template>
      <!-- <router-view /> -->
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import BgSvg from 'src/components/BgSvg.vue'
import {api} from 'boot/axios'
import {useQuasar} from 'quasar'
import {useCalendarStore} from 'src/stores/calendar'
import {useAccountStore} from 'src/stores/account'
import {useRouter} from 'vue-router'

const $q = useQuasar()
const $cal = useCalendarStore()
const $acc = useAccountStore()
const $router = useRouter()

const home = () => {
  $router.push('/')
}

const getCalendars = async () => {
  try {
    const {data} = await api.get('/lncalendar/api/v1/schedule')
    $cal.setCalendars(data)
  } catch (e) {
    $q.notify({
      message: 'Failed to fetch calendars!',
      color: 'negative',
      icon: 'warning'
    })
  } finally {
    $cal.initiated = true
  }
}

const getAccountWallets = async () => {
  try {
    const {data} = await api.get('/api/v1/auth')

    const wallets = data.wallets.map(w => ({
      label: w.name,
      value: w.id
    }))
    $acc.setWallets(wallets)
  } catch (error) {
    console.error(error)
    $q.notify({
      message: 'Failed to get user wallets!',
      color: 'negative'
    })
  }
}

onMounted(async () => {
  if ($acc.isLoggedIn) {
    await getCalendars()
    await getAccountWallets()
  }
})
</script>

<style lang="scss"></style>
