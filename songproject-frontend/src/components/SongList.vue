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
</template>

<script setup>
defineProps({
  songs: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
</script>

<style scoped>
.song-list {
  width: 100%;
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
  position: relative;
}

.song-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: var(--shadow-md), 0 0 0 1px var(--accent-dim);
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