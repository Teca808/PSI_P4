<template>
  <audio
    ref="audioEl"
    id="my-audio"
    :src="song?.audio_file"
    controls
    @timeupdate="handleTimeUpdate"
    @ended="handleEnded"
    class="audio-player"
  ></audio>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  song: { type: Object, required: true },
  stopAudio: { type: Boolean, default: false },
})

const emit = defineEmits(['onTimeUpdate', 'onEnded'])

const audioEl = ref(null)

function handleTimeUpdate() {
  if (audioEl.value) emit('onTimeUpdate', audioEl.value.currentTime)
}

function handleEnded() {
  emit('onEnded')
}

watch(() => props.stopAudio, (shouldStop) => {
  if (!audioEl.value) return
  if (shouldStop) {
    audioEl.value.pause()
  } else {
    audioEl.value.play().catch(() => {})
  }
})
</script>

<style scoped>
.audio-player {
  width: 100%;
  max-width: 600px;
  border-radius: var(--radius-md);
  filter: drop-shadow(0 2px 12px rgba(255, 255, 255, 0.25));
}

/* Estilo dark para los controles del reproductor */
.audio-player::-webkit-media-controls-panel {
  background: rgba(255, 255, 255, 0.95);
}
</style>