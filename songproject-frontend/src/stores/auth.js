import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // token e info del usuario
  const token = ref(sessionStorage.getItem('authToken') || null)
  const username = ref(sessionStorage.getItem('authUsername') || null)

  // Hay sesión activa?
  const isAuthenticated = computed(() => token.value !== null)

  // logea
  function setAuth(newToken, newUsername) {
    token.value = newToken
    username.value = newUsername
    sessionStorage.setItem('authToken', newToken)
    sessionStorage.setItem('authUsername', newUsername)
  }

  // logout
  function clearAuth() {
    token.value = null
    username.value = null
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('authUsername')
  }

  return {
    token,
    username,
    isAuthenticated,
    setAuth,
    clearAuth,
  }
})