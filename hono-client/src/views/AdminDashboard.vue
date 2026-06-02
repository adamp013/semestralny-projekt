<template>
    <div class="min-h-screen bg-[#fbf6e8] flex justify-center items-center">
        <aside
            class="w-[540px] bg-[#eadfcc] flex flex-col items-center py-12 px-8 border border-[#d9ceb9] rounded-2xl shadow-md gap-4">
            <h1>Admin Dashboard</h1>
            <p v-if="error">{{ error }}</p>
            <table v-if="users.length" class="border-b border-[#d9ceb9]">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Rola</th>
                        <th>Akcie</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id" class="border-b border-[#d9ceb9]">
                        <td class="py-3 px-4">{{ user.id }}</td>
                        <td class="py-3 px-4">{{ user.email }}</td>
                        <td class="py-3 px-4">{{ user.role }}</td>
                        <td class="py-3 px-4">
                            <AppButton size="sm" variant="danger" @click="handleDelete(user.id)">
                                Vymazať
                            </AppButton>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-else>Žiadni používatelia</p>
        </aside>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsers } from '../api/auth.js'
import AppButton from '@/components/ui/AppButton.vue'

const users = ref([])
const error = ref('')

async function handleDelete(id) {
    await fetch(`http://localhost:3000/api/auth/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    })
    users.value = users.value.filter(u => u.id !== id)
}

onMounted(async () => {
    const res = await getUsers()
    console.log('odpoved z getUsers:', res)
    if (res.users) {
        users.value = res.users
    } else {
        error.value = 'Nemáš oprávnenie'
    }
})
</script>