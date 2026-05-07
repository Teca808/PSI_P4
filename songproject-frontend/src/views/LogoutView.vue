<template>
  <div class="logout-view">
    <div class="logout-card">
      <span class="logout-icon">👋</span>
      <h2>See you soon</h2>
      <p>You'll be redirected home in <strong>{{ seconds }}</strong> seconds</p>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { apiFetch } from '@/api'

const router = useRouter()
const auth = useAuthStore()

const seconds = ref(5)
const progress = computed(() => ((5 - seconds.value) / 5) * 100)
let intervalId = null
let timeoutId = null

onMounted(async () => {
  try {
    if (auth.token) {
      await apiFetch('/api/v1/token/logout/', { method: 'POST' })
    }
  } catch (err) {
    console.warn('Could not invalidate server token:', err)
  } finally {
    auth.clearAuth()
  }

  intervalId = setInterval(() => {
    if (seconds.value > 0) seconds.value--
  }, 1000)

  timeoutId = setTimeout(() => {
    router.push('/')
  }, 5000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<style scoped>
.logout-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem 1rem;
}

.logout-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2.5rem 3rem;
  text-align: center;
  max-width: 400px;
  width: 100%;
  box-shadow: var(--shadow-md);
}

.logout-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent-dim);
  font-size: 2rem;
  margin-bottom: 1rem;
}

.logout-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.3px;
}

.logout-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.logout-card strong {
  color: var(--accent);
  font-weight: 700;
}

.progress-bar {
  height: 4px;
  background: var(--bg-elevated);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #6ba3ff);
  transition: width 1s linear;
  box-shadow: 0 0 12px var(--accent-glow);
}
</style>