<template>
  <div class="min-h-screen bg-[#fbf6e8] flex justify-center items-center">
    <aside
      class="w-[540px] bg-[#eadfcc] flex flex-col items-center py-12 px-8 border border-[#d9ceb9] rounded-2xl shadow-md gap-4">
      <h2>Prihlásenie</h2>
      
      <input v-model="email" type="email" placeholder="Email"
        class="w-full px-4 py-2 rounded-lg border border-[#d9ceb9] bg-[#fbf6e8] focus:outline-none focus:ring-2 focus:ring-[#b5a48a]" />

      <input v-model="password" type="password" placeholder="Heslo"
        class="w-full px-4 py-2 rounded-lg border border-[#d9ceb9] bg-[#fbf6e8] focus:outline-none focus:ring-2 focus:ring-[#b5a48a]" />
    
      <AppButton size="lg" variant="primary"@click="handleLogin">
        Prihlásiť sa
      </AppButton>
      <p v-if="error">{{ error }}</p>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/auth.js'
import AppButton from '@/components/ui/AppButton.vue'

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