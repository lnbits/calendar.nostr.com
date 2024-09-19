<template>
  <div class="fullscreen q-pa-md row">
    <div class="col-xs-12 col-sm-7 col-md-6 flex flex-center column q-pa-md">
      <div class="text-center q-mb-xl">
        <template v-if="!isRegister">
          <h4 class="q-mb-sm">Welcome back to Calendar</h4>
          <p class="caption">Enter username and password to continue</p>
        </template>
        <template v-else>
          <h4 class="q-mb-sm">Create an account</h4>
          <p class="caption">Register to access Calendar features</p>
        </template>
      </div>
      <q-form
        @submit.prevent="login"
        style="width: 70%; max-width: 400px"
      >
        <label class="text-weight-medium">Username</label>
        <q-input
          filled
          v-model="username"
          label="Enter your username"
          lazy-rules
          :rules="[val => !!val || 'Please enter username']"
        />
        <label class="text-weight-medium">Password</label>
        <q-input
          filled
          v-model="password"
          label="Enter your password"
          lazy-rules
          type="password"
          :rules="[val => !!val || 'Please enter password']"
        />
        <template v-if="isRegister">
          <label class="text-weight-medium">Repeat Password</label>
          <q-input
            filled
            v-model="password_repeat"
            label="Repeat your password"
            lazy-rules
            type="password"
            :rules="[val => !!val || 'Please repeat password']"
          />
        </template>
        <q-btn
          unelevated
          class="full-width q-mt-md"
          color="primary"
          :label="isRegister ? 'Register' : 'Login'"
          type="submit"
        />
      </q-form>
      <div class="q-mt-lg">
        <span
          v-text="
            isRegister
              ? 'Already have an account? '
              : 'Don\'t have an account? '
          "
        ></span>
        <span
          class="text-weight-bold cursor-pointer text-primary"
          @click="isRegister = !isRegister"
          v-text="isRegister ? 'Login' : 'Register'"
        ></span>
      </div>
      <div class="terms q-ma-md">
        <span>© 2024 Calendar. All rights reserved.</span>
        <span :class="$q.screen.gt.xs && 'float-right'">
          Terms of Service | Privacy Policy
        </span>
      </div>
    </div>
    <div
      v-if="$q.screen.gt.xs"
      class="col-sm-5 col-md-6 bg-blue"
    ></div>
  </div>
</template>

<script setup>
import {api} from 'boot/axios'
import {ref} from 'vue'
import {useAccountStore} from 'src/stores/account'
import {useQuasar} from 'quasar'

const $q = useQuasar()

const username = ref('')
const password = ref('')
const password_repeat = ref('')
const isRegister = ref(false)
const $acc = useAccountStore()

const login = async () => {
  if (isRegister.value) {
    return register()
  }
  try {
    const {data} = await api.post('/auth', {
      username: username.value,
      password: password.value
    })
    $acc.addUsername(username.value)
    $q.notify({
      message: 'Logged in!',
      color: 'positive'
    })
  } catch (error) {
    console.warning(error)
    $q.notify({
      message: 'Failed to login!',
      color: 'negative',
      icon: 'warning'
    })
  }
}

const register = async () => {
  try {
    const {data} = await api.post('/auth/register', {
      username: username.value,
      password: password.value,
      password_repeat: password.value
    })
    $acc.addUsername(username.value)
    // enable lncalendar extension
    await api.post('/extension/lncalendar/enable')
    this.q.notify({
      message: 'Signed Up!',
      color: 'positive'
    })
  } catch (error) {
    console.warn(error)
    $q.notify({
      message: 'Failed to register!',
      color: 'negative',
      icon: 'warning'
    })
  }
}
</script>

<style lang="scss">
.terms {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
@media screen and (min-width: $breakpoint-xs-max) {
  .terms {
    right: calc((100% * 5) / 12);
  }
}
@media screen and (min-width: $breakpoint-sm-max) {
  .terms {
    right: 50%;
  }
}
</style>
