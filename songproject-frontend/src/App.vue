<template>
  <div id="app">
    <!-- Barra de navegación -->
    <header class="navbar">
      <router-link to="/" class="logo">
        🎵 Songs
      </router-link>

      <nav class="nav-links">
        <router-link to="/" data-cy="home-cypress-test">Home</router-link>

        <router-link
          v-if="!auth.isAuthenticated"
          to="/log-in"
          data-cy="login-cypress-test"
        >
          Admin Log-In
        </router-link>
        <router-link v-else to="/log-out">Log-Out</router-link>

        <router-link to="/faq">FAQ</router-link>
      </nav>
    </header>

    <!-- Contenido principal: aquí se renderiza la vista activa -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #2c2c2c;
  color: white;
  border-bottom: 1px solid #444;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: #ccc;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: white;
}

.nav-links a.router-link-active {
  color: white;
  font-weight: 500;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.footer {
  text-align: center;
  padding: 1rem;
  background-color: #f5f5f5;
  color: #666;
  font-size: 0.85rem;
  border-top: 1px solid #e0e0e0;
}
</style>