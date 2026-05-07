<template>
  <div id="app">
    <header class="navbar">
      <router-link to="/" class="logo">
        <span class="logo-icon">♪</span>
        <span>Songs</span>
      </router-link>

      <nav class="nav-links">
        <router-link to="/" data-cy="home-cypress-test">Home</router-link>

        <router-link
          v-if="!auth.isAuthenticated"
          to="/log-in"
          data-cy="login-cypress-test"
        >
          Log In
        </router-link>
        <router-link v-else to="/log-out">Log Out</router-link>

        <router-link to="/faq">FAQ</router-link>
      </nav>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>© 2026 Songs · Learn languages through music</p>
    </footer>
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
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: rgba(19, 24, 38, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.logo-icon {
  font-size: 1.6rem;
  color: var(--accent);
  text-shadow: 0 0 16px var(--accent-glow);
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-links a {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.nav-links a:hover {
  color: var(--text-primary);
  background-color: var(--bg-elevated);
}

.nav-links a.router-link-active {
  color: var(--accent);
  background-color: var(--accent-dim);
}

.main-content {
  flex: 1;
  padding: 2.5rem 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.footer {
  text-align: center;
  padding: 1.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  border-top: 1px solid var(--border);
}

@media (max-width: 600px) {
  .navbar {
    padding: 0.75rem 1rem;
  }
  .nav-links a {
    padding: 0.4rem 0.7rem;
    font-size: 0.85rem;
  }
  .main-content {
    padding: 1.5rem 1rem;
  }
}
</style>