<template>
  <div class="play-view" :style="backgroundStyle">
    <div v-if="loading" class="loading">Loading song...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="song" class="overlay">
      <h1>{{ song.title }}</h1>
      <p class="artist">{{ song.artist }}</p>

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
      />

      <div v-if="summary" class="summary">
        <h2>Results</h2>
        <p>Correct: {{ summary.correct }}</p>
        <p>Wrong: {{ summary.wrong }}</p>
      </div>
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
  id: {
    type: String,
    required: true,
  },
})

const auth = useAuthStore()

const song = ref(null)
const loading = ref(false)
const error = ref('')
const currentTime = ref(0)
const stopAudio = ref(false)
const summary = ref(null)
const lyricsRef = ref(null)

const backgroundStyle = computed(() => {
  if (!song.value || !song.value.background_image) return {}
  return {
    backgroundImage: `url(${song.value.background_image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
})

onMounted(async () => {
  loading.value = true
  try {
    const songData = await apiFetch(`/api/v1/songs/${props.id}/`)

    // lrc_file es una URL absoluta: descargamos su contenido
    const lrcResponse = await fetch(songData.lrc_file)
    if (!lrcResponse.ok) throw new Error('No se pudo descargar el .lrc')
    const lrcText = await lrcResponse.text()

    song.value = {
      ...songData,
      lrc_content: lrcText,
    }
  } catch (err) {
    error.value = `No se pudo cargar la canción: ${err.message}`
    console.error(err)
  } finally {
    loading.value = false
  }
})

function onTimeUpdate(t) {
  currentTime.value = t
}

async function onEnded() {
  // Pedir el resumen final al componente de letras
  const result =
    lyricsRef.value && lyricsRef.value.getSummary
      ? lyricsRef.value.getSummary()
      : { correct: 0, wrong: 0 }

  summary.value = result

  // Si el usuario está autenticado, crear/actualizar SongUser
  if (auth.isAuthenticated && song.value) {
    try {
      await apiFetch('/api/v1/songusers/', {
        method: 'POST',
        body: JSON.stringify({
          song: song.value.id,
          correct_guesses: result.correct,
          wrong_guesses: result.wrong,
        }),
      })
    } catch (err) {
      console.error('No se pudo crear/actualizar SongUser:', err)
    }
  }
}
</script>

<style scoped>
.play-view {
  min-height: 70vh;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.overlay {
  min-height: 70vh;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.6) 70%,
    rgba(0, 0, 0, 0.85) 100%
  );
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.overlay h1 {
  font-weight: 400;
  margin: 0;
}

.artist {
  margin: 0 0 1rem 0;
  opacity: 0.9;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #dc2626;
}

.summary {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 1.5rem 2rem;
  border-radius: 8px;
  color: #333;
  text-align: center;
  text-shadow: none;
  margin-top: 1rem;
}

.summary h2 {
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.summary p {
  margin: 0.25rem 0;
}
</style>