<script setup>
import { ref } from 'vue'

const users = ref([])

async function fetchUsers() {
  const response = await fetch('http://localhost:3000/users')
  const usersResponse = await response.json()

  users.value = usersResponse
}

async function deleteUser(index) {
  const response = await fetch('http://localhost:3000/users/' + index, {
    method: 'delete',
  })

  const deleteUserResponse = await response.text()

  if (deleteUserResponse === 'ok') {
    await fetchUsers()
  }
}

const text = ref('')

async function addUser() {
  const response = await fetch('http://localhost:3000/users', {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      newUsername: text.value,
    }),
  })

  const responseText = await response.text()

  if (responseText === 'ok') {
    await fetchUsers()
  }
}
</script>

<template>
  <RouterView />
</template>
