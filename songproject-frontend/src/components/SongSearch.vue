<template>
  <div class="song-search">
    <form @submit.prevent="handleSearch" class="search-form">
      <input
        v-model="query"
        type="text"
        placeholder="Search songs by title"
        class="search-input"
      />
      <button type="submit" class="search-btn">Search</button>
    </form>

    <div v-if="searched" class="search-results">
      <SongList :songs="results" :loading="loading" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { apiFetch } from '@/api'
import SongList from './SongList.vue'

const query = ref('')
const results = ref([])
const loading = ref(false)
const searched = ref(false)

async function handleSearch() {
  if (!query.value.trim()) return

  loading.value = true
  searched.value = true
  try {
    // Endpoint de búsqueda del backend: devuelve array directo o 404
    const data = await apiFetch(`/api/v1/songs/search/?title=${encodeURIComponent(query.value)}`)
    results.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Error en búsqueda:', err)
    results.value = []
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.song-search {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.search-form {
  display: flex;
  gap: 0.5rem;
  background-color: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.5rem;
  font-size: 0.9rem;
  outline: none;
}

.search-btn {
  background-color: white;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.search-btn:hover {
  background-color: #3b82f6;
  color: white;
}

.search-results {
  margin-top: 1.5rem;
}
</style>