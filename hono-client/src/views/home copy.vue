<template>
    <div class="min-h-screen bg-[#fbf6e8] flex ">

        <aside class="w-[240px] min-h-screen bg-[#eadfcc] flex flex-col py-8 px-4 border-r border-[#d9ceb9]">

            <!-- Cast Logo-->
            <div class="flex items-center justify-center gap-3 mb-10 w-full">
                <div class="w-10 h-10 bg-[#ff8c42] rounded-full opacity-80 shrink-0"></div>
                <h1 class="text-2xl font-bold text-orange-600">Logo</h1>
            </div>
            <!-- Cast navigacie-->
            <div class="flex justify-around items-end mb-6 w-full px-2">
                <div class="flex flex-col items-center gap-1 cursor-pointer group">
                    <span class="text-2xl hover:scale-110 transition-transform duration-200">🏠</span>
                    <span
                        class="text-[10px] uppercase font-bold text-text opacity-60 group-hover:opacity-100">Home</span>
                </div>
                <div class="flex flex-col items-center gap-1 cursor-pointer group">
                    <span class="text-2xl hover:scale-110 transition-transform duration-200">📝</span>
                    <span
                        class="text-[10px] uppercase font-bold text-text opacity-60 group-hover:opacity-100">New</span>
                </div>
                <div class="flex flex-col items-center gap-1 cursor-pointer group">
                    <span class="text-2xl hover:scale-110 transition-transform duration-200">📌</span>
                    <span
                        class="text-[10px] uppercase font-bold text-text opacity-60 group-hover:opacity-100">Pins</span>
                </div>
            </div>

            <hr class="border-2 border-secondary opacity-20 mb-10 mx-2" />

            <!-- Cast Playlistov-->
            <div class="flex flex-col gap-10 overflow-y-auto items-center w-full p-4">
                <div class="flex flex-col items-center w-[140px]">
                    <div
                        class="w-[120px] h-[120px] bg-secondary rounded-xl cursor-pointer hover:shadow-2xl transition-all hover:scale-105 duration-300">
                    </div>
                    <span class="text-[13px] mt-3 text-secondary">Playlist 1</span>
                </div>

                <div class="flex flex-col items-center w-[140px]">
                    <div
                        class="w-[120px] h-[120px] bg-[var(--color-primary)] rounded-xl cursor-pointer hover:shadow-2xl transition-all hover:scale-105 duration-300">
                    </div>
                    <span class="text-[13px] mt-3 font-bold text-[var(--color-accent)] leading-tight">Playlist 2
                        (aktivny)</span>
                </div>

                <div class="flex flex-col items-center w-[140px]">
                    <div
                        class="w-[120px] h-[120px] bg-secondary rounded-xl cursor-pointer hover:shadow-2xl transition-all hover:scale-105 duration-300">
                    </div>
                    <span class="text-[13px] mt-3 text-secondary">Playlist 3</span>
                </div>
            </div>
        </aside>

        <!--Cast Header-->
        <div class="flex-1 flex flex-col">
            <header
                class="h-[72px] bg-[#faf3e0] flex flex-row items-center px-6 border-b border-[#d9ceb9] shadow-sm justify-end">

                <!-- Search bar -->
                <div class="w-[440px] h-[52px] bg-white rounded-full border border-[#d9ceb9]"></div>

                <!-- divider -->
                <div class="w-px h-8 bg-[#d9ceb9] mx-6"></div>

                <!-- Ikony -->
                <div class="flex items-center gap-4">
                    <span class="text-xl cursor-pointer">🔔</span>
                    <div class="w-9 h-9 bg-[#ff8c42] rounded-full opacity-80 cursor-pointer" @click="handleLogout"></div>
                </div>

            </header>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { logout } from '../api/auth.js'
import { deleteAccount } from '../api/auth.js'
import { useAuthStore } from '@/stores/authStore.js'

const router = useRouter()

const authStore = useAuthStore()

async function handleLogout() {
  await logout()
  authStore.clearUser()
  router.push('/sign-in')
}

</script>