<template>
  <audio
    ref="audioEl"
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
  song: {
    type: Object,
    required: true,
  },
  stopAudio: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['onTimeUpdate', 'onEnded'])

const audioEl = ref(null)

function handleTimeUpdate() {
  if (audioEl.value) {
    emit('onTimeUpdate', audioEl.value.currentTime)
  }
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
  max-width: 500px;
}
</style>