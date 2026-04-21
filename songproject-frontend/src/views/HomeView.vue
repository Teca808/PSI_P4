<template>
  <div class="home-view">
    <section class="hero">
      <h1>Learn a language through songs</h1>
      <p class="description">
        "Songs" is the new way to learn English and other languages through music
        and the lyrics of your favourite songs. Improve and practise your listening
        skills with the best music videos. Fill in the gaps to the lyrics as you
        listen and sing Karaoke to your favourites.
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
      <h2>Top Songs</h2>
      <SongList :songs="topSongs" :loading="loadingTop" />
    </section>

    <section class="search-section">
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

// Cargar top 3 canciones al montar
onMounted(async () => {
  loadingTop.value = true
  try {
    // Usar el endpoint custom del backend
    const data = await apiFetch('/api/v1/songs/top/?n=3')
    // devuelve un array directo
    topSongs.value = Array.isArray(data) ? data : []
  } catch (err) {
    error.value = `Error cargando top songs: ${err.message}`
    console.error(err)
  } finally {
    loadingTop.value = false
  }
})

async function playRandomSong() {
  loadingRandom.value = true
  error.value = ''
  try {
    // Llamar al endpoint random del backend
    const song = await apiFetch('/api/v1/songs/random/')
    router.push(`/songs/${song.id}`)
  } catch (err) {
    error.value = `Error con random song: ${err.message}`
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
  gap: 3rem;
  align-items: center;
  text-align: center;
}

.hero h1 {
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 1rem;
}

.description {
  max-width: 600px;
  color: #555;
  margin-bottom: 1.5rem;
}

.random-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.random-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.random-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.top-songs {
  width: 100%;
}

.top-songs h2 {
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.search-section {
  width: 100%;
}

.error {
  color: #dc2626;
  font-size: 0.9rem;
}
</style>