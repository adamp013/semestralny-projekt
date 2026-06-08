<template>
    <div class="min-h-screen bg-[#fbf6e8] flex">

        <!-- Sidebar -->
        <aside class="w-[240px] min-h-screen bg-[#eadfcc] flex flex-col py-8 px-4 border-r border-[#d9ceb9]">
            <div class="flex items-center justify-center gap-3 mb-10 w-full">
                <div class="w-10 h-10 bg-[#ff8c42] rounded-full opacity-80 shrink-0"></div>
                <h1 class="text-2xl font-bold text-orange-600">Logo</h1>
            </div>

            <hr class="border-2 border-secondary opacity-20 mb-6 mx-2" />

            <!-- Playlisty -->
            <div class="flex flex-col gap-4 overflow-y-auto items-center w-full p-4">
                <button @click="showCreatePlaylist = true"
                    class="w-full bg-[#ff8c42] text-white py-2 rounded-lg text-sm">
                    + Nový playlist
                </button>

                <div v-if="showCreatePlaylist" class="w-full flex gap-2">
                    <input v-model="newPlaylistName" placeholder="Názov"
                        class="flex-1 px-2 py-1 rounded border border-[#d9ceb9] text-sm" />
                    <button @click="handleCreatePlaylist"
                        class="bg-[#ff8c42] text-white px-2 rounded text-sm">OK</button>
                </div>

                <div v-for="playlist in playlists" :key="playlist.id"
                    class="flex flex-col items-center w-[140px] cursor-pointer" @click="selectPlaylist(playlist)">
                    <div :class="['w-[120px] h-[120px] rounded-xl hover:shadow-2xl transition-all hover:scale-105 duration-300',
                        selectedPlaylist?.id === playlist.id ? 'bg-[#ff8c42]' : 'bg-[#8c8a9e]']">
                    </div>
                    <span class="text-[13px] mt-3 text-center">{{ playlist.name }}</span>
                </div>
            </div>
        </aside>

        <!-- Main -->
        <div class="flex-1 flex flex-col">

            <!-- Header -->
            <header
                class="h-[72px] bg-[#faf3e0] flex items-center px-6 border-b border-[#d9ceb9] shadow-sm justify-between">
                <!-- Search -->
                <div class="relative w-[440px]">
                    <input v-model="searchQuery" @input="handleSearch" placeholder="Hľadaj piesne..."
                        class="w-full h-[44px] px-5 rounded-full border border-[#d9ceb9] bg-white focus:outline-none focus:ring-2 focus:ring-[#ff8c42]" />
                    <!-- Search výsledky -->
                    <div v-if="searchResults.length"
                        class="absolute top-12 left-0 w-full bg-white border border-[#d9ceb9] rounded-xl shadow-lg z-10">
                        <div v-for="song in searchResults" :key="song.id"
                            class="px-4 py-3 hover:bg-[#fbf6e8] cursor-pointer flex justify-between items-center"
                            @click="handleAddSong(song)">
                            <div>
                                <p class="font-medium text-sm">{{ song.title }}</p>
                                <p class="text-xs text-gray-500">{{ song.artist }}</p>
                            </div>
                            <span class="text-xs text-[#ff8c42]">+ Pridať</span>
                        </div>
                    </div>
                </div>

                <!-- Logout -->
                <div class="w-9 h-9 bg-[#ff8c42] rounded-full opacity-80 cursor-pointer" @click="handleLogout"></div>
            </header>

            <!-- Obsah playlistu -->
            <main class="p-8">
                <div v-if="selectedPlaylist">
                    <h2 class="text-2xl font-bold mb-6">{{ selectedPlaylist.name }}</h2>
                    <table class="w-full border-collapse">
                        <thead>
                            <tr class="border-b border-[#d9ceb9]">
                                <th class="py-3 px-4 text-left">#</th>
                                <th class="py-3 px-4 text-left">Názov</th>
                                <th class="py-3 px-4 text-left">Album</th>
                                <th class="py-3 px-4 text-left">Dátum pridania</th>
                                <th class="py-3 px-4 text-left">Dĺžka</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(song, index) in playlistSongs" :key="song.id"
                                class="border-b border-[#d9ceb9] hover:bg-[#f5ede0] cursor-pointer"
                                @click="playSong(song)">
                                <td class="py-3 px-4">{{ index + 1 }}</td>
                                <td class="py-3 px-4">{{ song.title }}</td>
                                <td class="py-3 px-4">{{ song.album }}</td>
                                <td class="py-3 px-4">{{ new Date(song.created_at).toLocaleDateString() }}</td>
                                <td class="py-3 px-4">{{ formatDuration(song.duration) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-if="!playlistSongs.length" class="text-gray-400 mt-4">Playlist je prázdny. Hľadaj piesne hore!
                    </p>
                </div>
                <div v-else class="text-gray-400">Vyber playlist</div>
            </main>

            <!-- Audio player -->
            <div v-if="currentSong"
                class="fixed bottom-0 left-0 right-0 h-[72px] bg-[#f4a261] border-t border-[#d9ceb9] flex items-center px-8 gap-4">
                <div>
                    <p class="font-semibold text-sm text-white">{{ currentSong.title }}</p>
                    <p class="text-xs text-gray-400">{{ currentSong.artist }}</p>
                </div>
                <audio :src="`http://localhost:3000/api/auth/songs/stream/${currentSong.id}`" controls class="flex-1"
                    :key="currentSong.id">
                </audio>
        </div>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '../api/auth.js'
import { useAuthStore } from '@/stores/authStore.js'
import { getPlaylists, createPlaylist, getPlaylistSongs, addSongToPlaylist, searchSongs } from '../api/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const playlists = ref([])
const selectedPlaylist = ref(null)
const playlistSongs = ref([])
const searchQuery = ref('')
const searchResults = ref([])
const currentSong = ref(null)
const showCreatePlaylist = ref(false)
const newPlaylistName = ref('')

function formatDuration(seconds) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
}

async function handleLogout() {
    await logout()
    authStore.clearUser()
    router.push('/sign-in')
}

async function handleCreatePlaylist() {
    if (!newPlaylistName.value) return
    const res = await createPlaylist(newPlaylistName.value)
    if (res.playlist) {
        playlists.value.unshift(res.playlist)
        newPlaylistName.value = ''
        showCreatePlaylist.value = false
    }
}

async function selectPlaylist(playlist) {
    selectedPlaylist.value = playlist
    const res = await getPlaylistSongs(playlist.id)
    if (res.songs) playlistSongs.value = res.songs
}

async function handleSearch() {
    if (!searchQuery.value) {
        searchResults.value = []
        return
    }
    const res = await searchSongs(searchQuery.value)
    if (res.songs) searchResults.value = res.songs
}

async function handleAddSong(song) {
    if (!selectedPlaylist.value) {
        alert('Najprv vyber playlist!')
        return
    }
    await addSongToPlaylist(selectedPlaylist.value.id, song.id)
    searchQuery.value = ''
    searchResults.value = []
    await selectPlaylist(selectedPlaylist.value)
}

function playSong(song) {
    currentSong.value = song
}

onMounted(async () => {
    const res = await getPlaylists()
    if (res.playlists) playlists.value = res.playlists
})
</script>