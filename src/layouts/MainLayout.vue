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
          <q-btn-dropdown
            class="nostr-card"
            v-if="$acc.isLoggedIn"
          >
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <q-avatar
                  size="26px"
                  class="q-mr-sm"
                >
                  <img src="~assets/nostrich-head-32.svg" />
                </q-avatar>
                <span v-text="$acc.username"></span>
              </div>
            </template>
            <q-list
              v-ripple
              style="min-width: 100px"
            >
              <q-separator />
              <q-item
                clickable
                v-close-popup
                to="/settings"
              >
                <q-item-section> <strong>Settings</strong></q-item-section>
              </q-item>
              <q-separator />
              <!-- <q-item clickable v-close-popup to="/wallets">
                <q-item-section>My Wallets</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup to="/cart">
                <q-item-section>Shopping Cart</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup to="/account">
                <q-item-section>Account</q-item-section>
              </q-item>
              <q-separator /> -->
              <q-item
                clickable
                v-close-popup
                @click="logout"
                class="text-teal-1 bg-grey-8"
              >
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <template v-else>
            <q-btn
              to="/login"
              rounded
              class="text-capitalize nostr-card"
              color="secondary"
              text-color="primary"
              label="Account"
            />
          </template>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container class="bg-image">
      <BgSvg />
      <router-view />
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

const search = ref('')
const date = ref($cal.getDateStr)

const home = () => {
  $router.push('/')
}

const logout = async () => {
  try {
    await api.post('/auth/logout')
    $acc.logout()
    $acc.$reset()
    setTimeout(() => $router.push('/'), 500)
  } catch (e) {
    $q.notify({
      message: 'Failed to logout!',
      color: 'negative',
      icon: 'warning'
    })
  }
}
</script>

<style lang="scss">
// .bg-image {
//   background: $primary;
//   background: linear-gradient(142deg, $primary 65%, $secondary 170%);

//   .svg {
//     opacity: 30%;
//   }
// }
// .container,
// .container-fluid {
//   max-width: $breakpoint-lg-min;
//   width: 100%;
//   margin-right: auto;
//   margin-left: auto;
//   padding-right: 1rem;
//   padding-left: 1rem;
// }

// .container {
//   @media (min-width: $breakpoint-sm-min) {
//     max-width: 700px;
//   }

//   @media (min-width: $breakpoint-md-min) {
//     max-width: 950px;
//   }

//   @media (min-width: $breakpoint-lg-min) {
//     max-width: 1200px;
//   }

//   @media (min-width: $breakpoint-xl-min) {
//     max-width: 1450px;
//   }
// }
</style>
