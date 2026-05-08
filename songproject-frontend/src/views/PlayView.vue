<template>
  <div v-if="loading" class="loading">Loading song...</div>
  <div v-else-if="error" class="error">{{ error }}</div>

  <div v-else-if="song" class="play-view">
    <div class="cover" :style="backgroundStyle">
      <div class="overlay">
        <div class="song-meta">
          <h1>{{ song.title }}</h1>
          <p class="artist">{{ song.artist }}</p>
        </div>

        <AudioPlayer
          :song="song"
          :stopAudio="stopAudio"
          @onTimeUpdate="onTimeUpdate"
          @onEnded="onEnded"
        />

        <LyricsDisplay
          ref="lyricsRef"
          :song="song"
          :currentTime="currentTime"
          @stopAudio="stopAudio = true"
          @startAudio="stopAudio = false"
          @scoreChange="onScoreChange"
        />
      </div>
    </div>

    <div class="score-panel" data-cy="summary">
      <div class="score-item">
        <span class="score-label">Correct answers</span>
        <span class="score-value correct">{{ liveSummary.correct }}</span>
      </div>
      <div class="score-divider">-</div>
      <div class="score-item">
        <span class="score-label">Wrong answers</span>
        <span class="score-value wrong">{{ liveSummary.wrong }}</span>
      </div>
      <p class="score-text-hidden">
        Correct answers: {{ liveSummary.correct }} - Wrong answers: {{ liveSummary.wrong }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { apiFetch } from '@/api'
import AudioPlayer from '@/components/AudioPlayer.vue'
import LyricsDisplay from '@/components/LyricsDisplay.vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  id: { type: String, required: true },
})

const auth = useAuthStore()

const song = ref(null)
const loading = ref(false)
const error = ref('')
const currentTime = ref(0)
const stopAudio = ref(false)
const liveSummary = ref({ correct: 0, wrong: 0 })
const lyricsRef = ref(null)
const backgroundStyle = computed(() => {
  if (!song.value || !song.value.background_image) return {}
  return {
    backgroundImage: `url(${song.value.background_image})`,
  }
})

onMounted(async () => {
  loading.value = true
  try {
    const songData = await apiFetch(`/api/v1/songs/${props.id}/`)
    const lrcResponse = await fetch(songData.lrc_file)
    if (!lrcResponse.ok) throw new Error('Could not fetch the .lrc file')
    const lrcText = await lrcResponse.text()
    song.value = { ...songData, lrc_content: lrcText }
  } catch (err) {
    error.value = `Could not load the song: ${err.message}`
    console.error(err)
  } finally {
    loading.value = false
  }
})

function onTimeUpdate(t) {
  currentTime.value = t
}

async function onScoreChange(score) {
  liveSummary.value = score
  if (auth.isAuthenticated && song.value) {
    try {
      await apiFetch('/api/v1/songusers/', {
        method: 'POST',
        body: JSON.stringify({
          song: song.value.id,
          correct_guesses: score.correct,
          wrong_guesses: score.wrong,
        }),
      })
    } catch (err) {
      console.error('Could not save SongUser:', err)
    }
  }
}

async function onEnded() {
  if (lyricsRef.value && lyricsRef.value.getSummary) {
    liveSummary.value = lyricsRef.value.getSummary()
  }

  stopAudio.value = true
}
</script>

<style scoped>
.play-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cover {
  position: relative;
  min-height: 500px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-size: cover;
  background-position: center;
  border: 1px solid var(--border);
}

.overlay {
  min-height: 500px;
  background: linear-gradient(
    to bottom,
    rgba(10, 14, 26, 0.3) 0%,
    rgba(10, 14, 26, 0.7) 50%,
    rgba(10, 14, 26, 0.95) 100%
  );
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 1.25rem;
}

.song-meta {
  text-align: center;
  margin-bottom: 0.5rem;
}

.score-text-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.song-meta h1 {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: white;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
  margin-bottom: 0.3rem;
}

.artist {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.05rem;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
}

.loading,
.error {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.error {
  color: var(--error);
}

.score-panel {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 2rem;
  padding: 1.25rem 2rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
  max-width: 200px;
}

.score-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  font-weight: 600;
}

.score-value {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -1px;
}

.score-value.correct {
  color: var(--success);
}

.score-value.wrong {
  color: var(--error);
}

.score-divider {
  font-size: 2rem;
  color: var(--text-muted);
  align-self: center;
}
</style>