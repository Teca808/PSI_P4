<template>
  <div class="song-list">
    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="songs.length === 0" class="empty">
      No songs found
    </div>

    <div v-else class="song-grid">
      <router-link
        v-for="song in songs"
        :key="song.id"
        :to="`/songs/${song.id}`"
        class="song-card"
      >
        <img
          v-if="song.background_image"
          :src="song.background_image"
          :alt="song.title"
          class="song-image"
        />
        <div v-else class="song-image-placeholder">🎵</div>

        <div class="song-info">
          <div class="song-title">{{ song.title }}</div>
          <div class="song-artist">{{ song.artist }}</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  songs: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.song-list {
  width: 100%;
}

.loading,
.empty {
  text-align: center;
  color: #999;
  padding: 2rem;
}

.song-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.song-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s, box-shadow 0.15s;
}

.song-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.song-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.song-image-placeholder {
  width: 100%;
  height: 160px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.song-info {
  padding: 0.75rem;
  text-align: center;
}

.song-title {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.25rem;
}

.song-artist {
  font-size: 0.85rem;
  color: #777;
}
</style>