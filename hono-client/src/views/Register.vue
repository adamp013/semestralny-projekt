<template>
  <div>
    <h2>Registrácia</h2>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Heslo" />
    <input v-model="passwordConfirm" type="password" placeholder="Zopakuj heslo" />
    <button @click="handleRegister">Registrovať sa</button>
    <p v-if="error">{{ error }}</p>
    <p v-if="success">{{ success }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../api/auth.js'

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const error = ref('')
const success = ref('')
const router = useRouter()

async function handleRegister() {
  if (password.value !== passwordConfirm.value) {
    error.value = 'Heslá sa nezhodujú'
    return
  }
  const res = await register(email.value, password.value)
  if (res.message) {
    success.value = 'Registrácia úspešná!'
    router.push('/sign-in')
  } else {
    error.value = res.error
  }
}
</script>