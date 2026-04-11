<template>
  <div>
    <h2>Prihlásenie</h2>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Heslo" />
    <button @click="handleLogin">Prihlasit sa</button>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/auth.js'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function handleLogin() {
  const res = await login(email.value, password.value)
  if (res.token) {
    localStorage.setItem('token', res.token)
    router.push('/')
  } else {
    error.value = res.error
  }
}
</script>