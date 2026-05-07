<template>
  <div class="login-view">
    <div class="login-card">
      <div class="login-header">
        <span class="login-icon">🔐</span>
        <h2>Welcome back</h2>
        <p class="subtitle">Log in to track your progress</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="field">
          <label>Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Your username"
            data-cy="username"
            required
            :disabled="loading"
          />
        </div>

        <div class="field">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Your password"
            data-cy="password"
            required
            :disabled="loading"
          />
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Log In' }}
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
    const data = await apiFetch('/api/v1/token/login/', {
      method: 'POST',
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })
    if (!data || !data.auth_token) {
      throw new Error('Unexpected server response')
    }
    auth.setAuth(data.auth_token, username.value)
    router.push('/')
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'Invalid username or password'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem 1rem;
}

.login-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 380px;
  box-shadow: var(--shadow-md);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--accent-dim);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.login-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

input {
  border: 1px solid var(--border-strong);
  background: var(--bg-elevated);
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.9rem;
  font-size: 0.95rem;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input::placeholder {
  color: var(--text-muted);
}

input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}

input:disabled {
  opacity: 0.5;
}

.login-btn {
  background: linear-gradient(135deg, var(--accent), #6ba3ff);
  color: white;
  border: none;
  padding: 0.85rem;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin-top: 0.5rem;
  transition: all 0.2s;
  box-shadow: var(--shadow-glow);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px var(--accent-glow);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  color: var(--error);
  font-size: 0.85rem;
  margin-top: 1rem;
  text-align: center;
  padding: 0.6rem;
  background: rgba(248, 113, 113, 0.1);
  border-radius: var(--radius-sm);
}
</style>