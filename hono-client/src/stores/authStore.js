import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isLoggedIn = ref(false)

    async function fetchMe() {
        try {
            const res = await fetch('http://localhost:3000/api/auth/me', {
                credentials: 'include'
            })
            if (res.ok) {
                const data = await res.json()
                user.value = data
                isLoggedIn.value = true
            } else {
                user.value = null
                isLoggedIn.value = false
            }
        } catch {
            user.value = null
            isLoggedIn.value = false
        }
    }

    function clearUser() {
        user.value = null
        isLoggedIn.value = false
    }

    return { user, isLoggedIn, fetchMe, clearUser }
})