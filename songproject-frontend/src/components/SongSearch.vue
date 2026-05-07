<template>
  <div class="song-search">
    <form @submit.prevent="handleSearch" class="search-form">
      <span class="search-icon">🔍</span>
      <input
        v-model="query"
        type="text"
        placeholder="Search songs by title..."
        class="search-input"
        data-cy="search_text"
      />
      <button type="submit" class="search-btn" data-cy="search_button">
        Search
      </button>
    </form>

    <div v-if="searched" class="search-results">
      <div v-if="loading" class="loading">Searching...</div>
      <div v-else-if="results.length === 0" class="empty">
        No songs match your search
      </div>
      <div v-else class="song-grid">
        <router-link
          v-for="song in results"
          :key="song.id"
          :to="`/songs/${song.id}`"
          class="song-card"
          :data-cy="song.title"
        >
          <div class="song-image-wrapper">
            <img
              v-if="song.background_image"
              :src="song.background_image"
              :alt="song.title"
              class="song-image"
            />
            <div v-else class="song-image-placeholder">♪</div>
            <div class="play-overlay">
              <span class="play-icon">▶</span>
            </div>
          </div>
          <div class="song-info">
            <div class="song-title">{{ song.title }}</div>
            <div class="song-artist">{{ song.artist }}</div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { apiFetch } from '@/api'

const query = ref('')
const results = ref([])
const loading = ref(false)
const searched = ref(false)

async function handleSearch() {
  if (!query.value.trim()) return
  loading.value = true
  searched.value = true
  try {
    const data = await apiFetch(`/api/v1/songs/search/?title=${encodeURIComponent(query.value)}`)
    results.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Search error:', err)
    results.value = []
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.song-search {
  width: 100%;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: border-color 0.2s;
}

.search-form:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}

.search-icon {
  padding: 0 0.5rem;
  font-size: 0.9rem;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.6rem 0.25rem;
  font-size: 0.95rem;
  color: var(--text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
}

.search-btn:hover {
  background: var(--accent-hover);
}

.search-results {
  margin-top: 2rem;
}

.loading,
.empty {
  text-align: center;
  color: var(--text-muted);
  padding: 2rem;
}

.song-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.song-card {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all 0.25s;
}

.song-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: var(--shadow-md);
}

.song-image-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.song-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.song-card:hover .song-image {
  transform: scale(1.05);
}

.song-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  background: linear-gradient(135deg, var(--bg-elevated), var(--bg-card));
  color: var(--accent);
}

.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 14, 26, 0.6);
  opacity: 0;
  transition: opacity 0.25s;
}

.song-card:hover .play-overlay {
  opacity: 1;
}

.play-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  border-radius: 50%;
  font-size: 1.2rem;
  color: white;
  padding-left: 4px;
  box-shadow: 0 0 32px var(--accent-glow);
}

.song-info {
  padding: 1rem;
}

.song-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style>