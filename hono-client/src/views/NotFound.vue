<template>
    <div class="min-h-screen bg-[#fbf6e8] flex flex-col justify-center items-center gap-4">
        <h1 class="text-6xl font-bold">404</h1>
        <p class="text-xl">Stránka neexistuje</p>
        <AppButton size="sm" variant="primary" @click="router.push('/')">
            Späť domov
        </AppButton>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
const router = useRouter()
</script>