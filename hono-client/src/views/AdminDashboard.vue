<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

    <!-- Users -->
    <h2 class="text-xl font-semibold mb-3">Používatelia</h2>
    <table class="w-full mb-10 border-collapse">
      <thead>
        <tr class="border-b border-[#d9ceb9]">
          <th class="py-3 px-4 text-left">ID</th>
          <th class="py-3 px-4 text-left">Email</th>
          <th class="py-3 px-4 text-left">Rola</th>
          <th class="py-3 px-4 text-left">Akcie</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="border-b border-[#d9ceb9]">
          <td class="py-3 px-4">{{ user.id }}</td>
          <td class="py-3 px-4">{{ user.email }}</td>
          <td class="py-3 px-4">{{ user.role }}</td>
          <td class="py-3 px-4">
            <button @click="handleDeleteUser(user.id)" class="text-red-500">Vymazať</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Songs -->
    <h2 class="text-xl font-semibold mb-3">Piesne</h2>

    <!-- Formular -->
    <div class="flex flex-col gap-2 mb-6 max-w-md">
      <input v-model="newSong.title" placeholder="Názov" class="px-3 py-2 rounded border border-[#d9ceb9]" />
      <input v-model="newSong.artist" placeholder="Interpret" class="px-3 py-2 rounded border border-[#d9ceb9]" />
      <input v-model="newSong.album" placeholder="Album" class="px-3 py-2 rounded border border-[#d9ceb9]" />
      <input v-model="newSong.genre" placeholder="Žáner" class="px-3 py-2 rounded border border-[#d9ceb9]" />
      <input v-model="newSong.duration" placeholder="Dĺžka (sekundy)" type="number"
        class="px-3 py-2 rounded border border-[#d9ceb9]" />
      <input type="file" accept=".mp3" @change="(e) => songFile = e.target.files[0]" class="text-sm" />
      <button @click="handleCreateSong" class="bg-[#ff8c42] text-white py-2 rounded">Pridať pieseň</button>
    </div>

  <div v-if="editingSong" class="flex flex-col gap-2 mb-6 max-w-md border border-[#d9ceb9] p-4 rounded">
  <h3 class="font-semibold">Upraviť pieseň</h3>
  <input v-model="editingSong.title" placeholder="Názov" class="px-3 py-2 rounded border border-[#d9ceb9]" />
  <input v-model="editingSong.artist" placeholder="Interpret" class="px-3 py-2 rounded border border-[#d9ceb9]" />
  <input v-model="editingSong.album" placeholder="Album" class="px-3 py-2 rounded border border-[#d9ceb9]" />
  <input v-model="editingSong.genre" placeholder="Žáner" class="px-3 py-2 rounded border border-[#d9ceb9]" />
  <input v-model="editingSong.duration" placeholder="Dĺžka (sekundy)" type="number" class="px-3 py-2 rounded border border-[#d9ceb9]" />
  <label class="text-sm text-gray-500">Nahrať MP3 súbor:</label>
  <input type="file" accept=".mp3" @change="(e) => editFile = e.target.files[0]" class="text-sm" />
  <div class="flex gap-2">
    <button @click="handleUpdateSong" class="bg-[#ff8c42] text-white py-2 px-4 rounded">Uložiť</button>
    <button @click="editingSong = null; editFile = null" class="bg-gray-300 py-2 px-4 rounded">Zrušiť</button>
  </div>
</div>

    <table class="w-full border-collapse">
      <thead>
        <tr class="border-b border-[#d9ceb9]">
          <th class="py-3 px-4 text-left">Názov</th>
          <th class="py-3 px-4 text-left">Interpret</th>
          <th class="py-3 px-4 text-left">Album</th>
          <th class="py-3 px-4 text-left">Žáner</th>
          <th class="py-3 px-4 text-left">Dĺžka</th>
          <th class="py-3 px-4 text-left">Stav</th>
          <th class="py-3 px-4 text-left">Akcie</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="song in songs" :key="song.id" class="border-b border-[#d9ceb9]">
          <td class="py-3 px-4">{{ song.title }}</td>
          <td class="py-3 px-4">{{ song.artist }}</td>
          <td class="py-3 px-4">{{ song.album }}</td>
          <td class="py-3 px-4">{{ song.genre }}</td>
          <td class="py-3 px-4">{{ formatDuration(song.duration) }}</td>
          <td class="py-3 px-4">
            <span v-if="song.file_path" class="text-green-500 mr-2" title="Súbor nahraný">✓ Nahraté</span>
            <span v-else class="text-red-400 mr-2" title="Súbor nie je nahraný">✗ Bez súboru</span>
          </td>
          <td class="py-3 px-4 flex gap-2 items-center">
            <button @click="startEdit(song)" class="text-blue-500">Upraviť</button>
            <button @click="handleDeleteSong(song.id)" class="text-red-500">Vymazať</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsers, getSongs, createSong, deleteSong } from '../api/auth.js'
import { updateSong } from '../api/auth.js'

const editingSong = ref(null)
const users = ref([])
const songs = ref([])
const newSong = ref({ title: '', artist: '', album: '', genre: '', duration: '' })
const songFile = ref(null)
const editFile = ref(null)

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

async function handleDeleteUser(id) {
  await fetch(`http://localhost:3000/api/auth/admin/users/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  users.value = users.value.filter(u => u.id !== id)
}

async function handleCreateSong() {
  const res = await createSong(newSong.value)
  if (res.song) {
    // Ak bol vybraty subor, uploadni ho
    if (songFile.value) {
      const formData = new FormData()
      formData.append('file', songFile.value)
      await fetch(`http://localhost:3000/api/auth/songs/upload/${res.song.id}`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
    }
    songs.value.unshift(res.song)
    newSong.value = { title: '', artist: '', album: '', genre: '', duration: '' }
    songFile.value = null
  }
}

async function handleDeleteSong(id) {
  await deleteSong(id)
  songs.value = songs.value.filter(s => s.id !== id)
}

onMounted(async () => {
  const usersRes = await getUsers()
  if (usersRes.users) users.value = usersRes.users

  const songsRes = await getSongs()
  if (songsRes.songs) songs.value = songsRes.songs
})

async function handleUpload(event, songId) {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`http://localhost:3000/api/auth/songs/upload/${songId}`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  })
  const data = await res.json()
  if (data.message) {
    alert('Súbor nahraný!')
  } else {
    alert(data.error)
  }
}

function startEdit(song) {
  editingSong.value = { ...song }
}

async function handleUpdateSong() {
  const res = await updateSong(editingSong.value.id, editingSong.value)
  if (res.song) {
    if (editFile.value) {
      const formData = new FormData()
      formData.append('file', editFile.value)
      await fetch(`http://localhost:3000/api/auth/songs/upload/${editingSong.value.id}`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      res.song.file_path = 'uploaded'
    }
    const index = songs.value.findIndex(s => s.id === res.song.id)
    songs.value[index] = res.song
    editingSong.value = null
    editFile.value = null
  }
}
</script>