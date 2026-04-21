<template>
  <div class="logout-view">
    <div class="logout-card">
      <h2>Log Out</h2>
      <p>You will be redirected to home in {{ seconds }} seconds</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { apiFetch } from '@/api'

const router = useRouter()
const auth = useAuthStore()

const seconds = ref(5)
let intervalId = null
let timeoutId = null

onMounted(async () => {
  // Intentar invalidar el token en el servidor
  try {
    if (auth.token) {
      await apiFetch('/api/v1/token/logout/', {
        method: 'POST',
      })
    }
  } catch (err) {
    // Si falla, lo ignoramos: lo importante es limpiar el cliente
    console.warn('No se pudo invalidar el token en el servidor:', err)
  } finally {
    // Limpieza del cliente SIEMPRE
    auth.clearAuth()
  }

  // Cuenta atrás visual
  intervalId = setInterval(() => {
    if (seconds.value > 0) seconds.value--
  }, 1000)

  // Redirección a los 5 segundos
  timeoutId = setTimeout(() => {
    router.push('/')
  }, 5000)
})

onUnmounted(() => {
  // Limpiar timers si el usuario navega antes del timeout
  if (intervalId) clearInterval(intervalId)
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<style scoped>
.logout-view {
  display: flex;
  justify-content: center;
  padding-top: 3rem;
}

.logout-card {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 2rem 3rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.logout-card h2 {
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: #555;
}

.logout-card p {
  color: #777;
  font-size: 0.9rem;
}
</style>