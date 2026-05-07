<template>
  <div class="home-view">
    <section class="hero">
      <h1>
        Learn languages through
        <span class="accent">songs</span>
      </h1>
      <p class="description">
        Improve your listening skills with the music you love. Fill in the gaps
        of your favorite lyrics and turn karaoke into a learning experience.
      </p>

      <button
        class="random-btn"
        @click="playRandomSong"
        :disabled="loadingRandom"
      >
        {{ loadingRandom ? 'Loading...' : 'Random song' }}
      </button>
    </section>

    <section class="top-songs">
      <h2 class="section-title">
        <span class="section-bar"></span>
        Top Songs
      </h2>
      <SongList :songs="topSongs" :loading="loadingTop" />
    </section>

    <section class="search-section">
      <h2 class="section-title">
        <span class="section-bar"></span>
        Find a song
      </h2>
      <SongSearch />
    </section>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/api'
import SongList from '@/components/SongList.vue'
import SongSearch from '@/components/SongSearch.vue'

const router = useRouter()

const topSongs = ref([])
const loadingTop = ref(false)
const loadingRandom = ref(false)
const error = ref('')

onMounted(async () => {
  loadingTop.value = true
  try {
    topSongs.value = await apiFetch('/api/v1/songs/top/?n=3')
  } catch (err) {
    error.value = `Error loading top songs: ${err.message}`
    console.error(err)
  } finally {
    loadingTop.value = false
  }
})

async function playRandomSong() {
  loadingRandom.value = true
  error.value = ''
  try {
    const song = await apiFetch('/api/v1/songs/random/')
    router.push(`/songs/${song.id}`)
  } catch (err) {
    error.value = `Error: ${err.message}`
    console.error(err)
  } finally {
    loadingRandom.value = false
  }
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.hero {
  text-align: center;
  padding: 3rem 0 1rem;
}

.hero h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero h1 .accent {
  color: var(--accent);
  text-shadow: 0 0 32px var(--accent-glow);
}

.description {
  max-width: 600px;
  margin: 0 auto 2rem;
  color: var(--text-secondary);
  font-size: 1.05rem;
}

.random-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--accent), #6ba3ff);
  color: white;
  border: none;
  padding: 0.85rem 1.75rem;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  box-shadow: var(--shadow-glow);
  transition: all 0.2s;
}

.random-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px var(--accent-glow);
}

.random-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: -0.3px;
}

.section-bar {
  width: 4px;
  height: 24px;
  background: var(--accent);
  border-radius: 2px;
  box-shadow: 0 0 12px var(--accent-glow);
}

.error {
  color: var(--error);
  text-align: center;
  font-size: 0.9rem;
}
</style>