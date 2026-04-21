<template>
  <div class="login-view">
    <div class="login-card">
      <h2>Login</h2>

      <form @submit.prevent="handleLogin">
        <input
          v-model="username"
          type="text"
          placeholder="username"
          required
          :disabled="loading"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          :disabled="loading"
        />

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'LOGGING IN...' : 'LOG IN' }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { apiFetch } from '@/api'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    // Endpoint djoser + TokenAuthentication
    const data = await apiFetch('/api/v1/token/login/', {
      method: 'POST',
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })

    // djoser token login devuelve: { "auth_token": "..." }
    if (!data || !data.auth_token) {
      throw new Error('Respuesta inesperada del servidor')
    }

    auth.setAuth(data.auth_token, username.value)
    router.push('/')
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'Usuario o contraseña incorrectos'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  padding-top: 3rem;
}

.login-card {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1.5rem 2rem;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.login-card h2 {
  text-align: center;
  font-weight: 500;
  margin-bottom: 1.5rem;
  color: #555;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  outline: none;
}

input:focus {
  border-bottom-color: #3b82f6;
}

input:disabled {
  background-color: #f5f5f5;
}

.login-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  margin-top: 1rem;
}

.login-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.login-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 1rem;
  text-align: center;
}
</style>