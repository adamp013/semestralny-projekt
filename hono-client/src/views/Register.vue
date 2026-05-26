<template>
  <div class="min-h-screen bg-[#fbf6e8] flex justify-center items-center">
    <aside class="w-[540px] bg-[#eadfcc] flex flex-col items-center py-12 px-8 border border-[#d9ceb9] rounded-2xl shadow-md gap-4">
      <h2 class="text-2xl font-semibold text-[#4a3f2f] mb-2">Registrácia</h2>

      <input v-model="email" type="email" placeholder="Email"
        class="w-full px-4 py-2 rounded-lg border border-[#d9ceb9] bg-[#fbf6e8] focus:outline-none focus:ring-2 focus:ring-[#b5a48a]"
      />
      <input v-model="password" type="password" placeholder="Heslo"
        class="w-full px-4 py-2 rounded-lg border border-[#d9ceb9] bg-[#fbf6e8] focus:outline-none focus:ring-2 focus:ring-[#b5a48a]"
      />
      <input v-model="passwordConfirm" type="password" placeholder="Zopakuj heslo"
        class="w-full px-4 py-2 rounded-lg border border-[#d9ceb9] bg-[#fbf6e8] focus:outline-none focus:ring-2 focus:ring-[#b5a48a]"
      />

      <AppButton size="lg" variant="primary" @click="handleRegister">
        Registrovať sa
      </AppButton>

      <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>
      <p v-if="success" class="text-green-700 text-sm text-center">{{ success }}</p>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../api/auth.js'
import AppButton from '@/components/ui/AppButton.vue'

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const error = ref('')
const success = ref('')
const router = useRouter()

async function handleRegister() {
   if (!email.value || !password.value || !passwordConfirm.value) {
    error.value = 'Vyplň všetky polia'
    return
  }
  if (password.value !== passwordConfirm.value) {
    error.value = 'Heslá sa nezhodujú'
    return
  }
  const res = await register(email.value, password.value)
  if (res.message) {
    success.value = 'Registrácia úspešná!'
    router.push('/sign-in')
  } else if (res.error === 'Email už existuje') {
    error.value = 'Tento email je už zaregistrovaný'
  }
  else {
    error.value = res.error
  }
}
</script>