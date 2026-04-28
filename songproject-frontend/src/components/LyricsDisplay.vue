<template>
  <div class="lyrics-display">
    <div v-if="lines.length === 0" class="no-lyrics">No lyrics available</div>

    <div v-else class="lines">
      <div
        v-for="offset in [-1, 0, 1]"
        :key="offset"
        class="line"
        :class="{ active: offset === 0, adjacent: offset !== 0 }"
      >
        <template v-if="getLine(currentIndex + offset)">
          <span>{{ getLine(currentIndex + offset).textBefore }}</span>

          <template v-if="getLine(currentIndex + offset).hasGap">
            <template v-if="offset === 0">
              <input
                ref="gapInput"
                v-model="userInput"
                type="text"
                class="gap-input"
                :class="{ correct: isResolved && isCorrect, incorrect: wasWrong }"
                :disabled="isResolved"
                @input="handleInput"
                autocomplete="off"
                spellcheck="false"
              />
              <button
                v-if="!isResolved"
                class="skip-btn"
                @click="handleSkip"
                type="button"
              >
                Skip
              </button>
            </template>
            <template v-else>
              <span class="gap-preview">____</span>
            </template>
          </template>

          <span>{{ getLine(currentIndex + offset).textAfter }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { parseLrc, getCurrentLineIndex } from '@/utils/lrcParser'

const props = defineProps({
  song: {
    type: Object,
    required: true,
  },
  currentTime: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['stopAudio', 'startAudio'])

// Parsear el .lrc una sola vez por canción
const lines = computed(() => {
  const lrc = props.song?.lrc_content || ''
  return parseLrc(lrc)
})

// Estado por línea: { resolved, correct, skipped, attempts }
const lineState = ref({})

// Estado del input actual
const userInput = ref('')
const wasWrong = ref(false)
const gapInput = ref(null)

// Contadores totales
let totalCorrect = 0
let totalWrong = 0

const currentIndex = computed(() =>
  getCurrentLineIndex(props.currentTime, lines.value)
)

const currentLineState = computed(
  () => lineState.value[currentIndex.value] || null
)

const isResolved = computed(() => currentLineState.value?.resolved === true)
const isCorrect = computed(() => currentLineState.value?.correct === true)

function ensureLineState(idx) {
  if (!lineState.value[idx]) {
    lineState.value[idx] = {
      resolved: false,
      correct: false,
      skipped: false,
      attempts: 0,
    }
  }
}

function getLine(idx) {
  if (idx < 0 || idx >= lines.value.length) return null
  return lines.value[idx]
}

function normalize(s) {
  return (s || '').trim().toLowerCase()
}

function handleInput() {
  const idx = currentIndex.value
  const line = getLine(idx)
  if (!line || !line.hasGap) return

  ensureLineState(idx)
  const state = lineState.value[idx]
  if (state.resolved) return

  const expected = normalize(line.hiddenWord)
  const typed = normalize(userInput.value)

  if (typed === expected) {
    state.correct = true
    state.resolved = true
    totalCorrect++
    wasWrong.value = false
    emit('startAudio')
  }
}

function handleSkip() {
  const idx = currentIndex.value
  const line = getLine(idx)
  if (!line || !line.hasGap) return

  ensureLineState(idx)
  const state = lineState.value[idx]
  if (state.resolved) return

  state.skipped = true
  state.resolved = true
  state.attempts++
  totalWrong++
  wasWrong.value = false
  emit('startAudio')
}

// Cuando cambia la línea actual: cerrar la anterior si quedó pendiente y resetear input
watch(currentIndex, (newIdx, oldIdx) => {
  if (oldIdx >= 0 && oldIdx !== newIdx) {
    const prevLine = getLine(oldIdx)
    if (prevLine?.hasGap) {
      const prevState = lineState.value[oldIdx]
      if (prevState && !prevState.resolved) {
        const failedAttempts = Math.max(prevState.attempts, 1)
        totalWrong += failedAttempts
        prevState.resolved = true
      }
    }
  }

  userInput.value = ''
  wasWrong.value = false

  const newLine = getLine(newIdx)
  if (newLine?.hasGap) {
    nextTick(() => {
      if (gapInput.value) gapInput.value.focus()
    })
  }
})

// Detectar fin de línea con hueco no resuelto: parar el audio
watch(
  () => props.currentTime,
  (t) => {
    const idx = currentIndex.value
    const line = getLine(idx)
    if (!line || !line.hasGap) return

    ensureLineState(idx)
    const state = lineState.value[idx]
    if (state.resolved) return

    const nextLine = getLine(idx + 1)
    const lineEndTime = nextLine ? nextLine.time : Infinity

    if (t >= lineEndTime - 0.05) {
      if (userInput.value.trim() !== '') {
        state.attempts++
        wasWrong.value = true
      }
      emit('stopAudio')
    }
  }
)

function getSummary() {
  // Cerrar la última línea si quedó pendiente
  const idx = currentIndex.value
  const line = getLine(idx)
  if (line?.hasGap) {
    const state = lineState.value[idx]
    if (state && !state.resolved) {
      const failedAttempts = Math.max(state.attempts, 1)
      totalWrong += failedAttempts
      state.resolved = true
    }
  }
  return { correct: totalCorrect, wrong: totalWrong }
}

defineExpose({ getSummary })
</script>

<style scoped>
.lyrics-display {
  max-width: 800px;
  margin: 1rem auto;
  text-align: center;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
}

.lines {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.line {
  min-height: 1.8rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  font-size: 1rem;
}

.line.adjacent {
  opacity: 0.55;
  font-size: 0.9rem;
}

.line.active {
  font-weight: bold;
  font-size: 1.1rem;
}

.gap-input {
  padding: 0.2rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 0.9rem;
  outline: none;
  text-align: center;
  min-width: 90px;
  color: #111;
  background: white;
  text-shadow: none;
}

.gap-input.correct {
  background-color: #d4edda;
  border-color: #28a745;
}

.gap-input.incorrect {
  background-color: #f8d7da;
  border-color: #dc3545;
}

.gap-preview {
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
}

.skip-btn {
  padding: 0.2rem 0.6rem;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 0.8rem;
  cursor: pointer;
  color: #333;
  text-shadow: none;
}

.skip-btn:hover {
  background-color: #e0e0e0;
}

.no-lyrics {
  color: #ddd;
}
</style>