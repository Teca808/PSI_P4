<template>
  <div class="play-view" :style="backgroundStyle">
    <div v-if="loading" class="loading">Loading song...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else>
      <h1>{{ song.title }}</h1>
      <p class="artist">{{ song.artist }}</p>

      <AudioPlayer :song="song" @onTimeUpdate="onTimeUpdate" @onEnded="onEnded" />

      <LyricsDisplay ref="lyricsRef" :song="song" :currentTime="currentTime" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
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

const router = useRouter()
const auth = useAuthStore()

const song = ref(null)
const loading = ref(false)
const error = ref('')
const currentTime = ref(0)
const lyricsRef = ref(null)

const backgroundStyle = computed(() => {
  if (!song.value || !song.value.background_image) return {}
  return {
    backgroundImage: `url(${song.value.background_image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '2rem',
  }
})

onMounted(async () => {
  loading.value = true
  try {
    const songData = await apiFetch(`/api/v1/songs/${props.id}/`)

    // lrc_file es una URL absoluta: hay que descargar su contenido
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
  // Al acabar la canción, si el usuario está autenticado, crear/actualizar SongUser
  try {
    if (auth.isAuthenticated && song.value) {
      // Obtener resumen desde LyricsDisplay expuesto
      const summary = lyricsRef.value && lyricsRef.value.getSummary ? lyricsRef.value.getSummary() : { correct: 0, wrong: 0 }

      const body = {
        song: song.value.id,
        correct_guesses: summary.correct,
        wrong_guesses: summary.wrong,
      }

      await apiFetch('/api/v1/songusers/', {
        method: 'POST',
        body: JSON.stringify(body),
      })
    }
  } catch (err) {
    console.error('No se pudo crear/actualizar SongUser:', err)
  }
}
</script>

<style scoped>
.play-view {
  text-align: center;
}

.play-view h1 {
  font-weight: 400;
  margin-bottom: 0.25rem;
}

.artist {
  color: #666;
  margin-bottom: 1rem;
}

.loading {
  color: #777;
}

.error {
  color: #dc2626;
}
</style>