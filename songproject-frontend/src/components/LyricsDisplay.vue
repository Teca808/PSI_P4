<template>
  <div class="lyrics-display">
    <div v-if="lines.length === 0" class="no-lyrics">No lyrics available</div>

    <div v-else class="lines">
      <!-- Línea anterior -->
      <div class="line adjacent">
        <template v-if="getLine(currentIndex - 1)">
          <span>{{ renderLine(getLine(currentIndex - 1)) }}</span>
        </template>
      </div>

      <!-- Línea actual -->
      <div class="line active">
        <template v-if="currentLine">
          <span>{{ currentLine.textBefore }}</span>

          <template v-if="currentLine.hasGap">
            <input
              ref="gapInputEl"
              v-model="userInput"
              type="text"
              class="gap-input"
              data-cy="blankInput"
              :class="{ correct: isCorrect, incorrect: wasWrong }"
              :disabled="isLocked"
              @keydown.enter.prevent="handleEnter"
              autocomplete="off"
              spellcheck="false"
            />
            <button
              v-if="!isLocked"
              class="skip-btn"
              data-cy="skip"
              @click="handleSkip"
              type="button"
            >
              Skip
            </button>
          </template>

          <span>{{ currentLine.textAfter }}</span>
        </template>
      </div>

      <!-- Línea siguiente -->
      <div class="line adjacent">
        <template v-if="getLine(currentIndex + 1)">
          <span>{{ renderLine(getLine(currentIndex + 1)) }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, reactive } from 'vue'
import { parseLrc, getCurrentLineIndex } from '@/utils/lrcParser'

const props = defineProps({
  song: { type: Object, required: true },
  currentTime: { type: Number, default: 0 },
})

const emit = defineEmits(['stopAudio', 'startAudio'])

const lines = computed(() => {
  const lrc = props.song?.lrc_content || ''
  return parseLrc(lrc)
})

const lineState = reactive({})
const userInput = ref('')
const wasWrong = ref(false)
const gapInputEl = ref(null)

let totalCorrect = 0
let totalWrong = 0

const currentIndex = computed(() =>
  getCurrentLineIndex(props.currentTime, lines.value)
)

const currentLine = computed(() => getLine(currentIndex.value))

const currentLineState = computed(
  () => lineState[currentIndex.value] || null
)

const isLocked = computed(() => {
  const s = currentLineState.value
  return s?.correct === true || s?.skipped === true
})

const isCorrect = computed(() => currentLineState.value?.correct === true)

function ensureLineState(idx) {
  if (!lineState[idx]) {
    lineState[idx] = {
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

function renderLine(line) {
  if (!line) return ''
  if (!line.hasGap) return line.textBefore
  return `${line.textBefore}____${line.textAfter}`
}

function handleEnter() {
  const idx = currentIndex.value
  const line = getLine(idx)
  if (!line || !line.hasGap) return

  ensureLineState(idx)
  const state = lineState[idx]
  if (state.correct || state.skipped) return

  const expected = normalize(line.hiddenWord)
  const typed = normalize(userInput.value)

  if (typed === expected) {
    state.correct = true
    totalCorrect++
    wasWrong.value = false
    emit('startAudio')
  } else if (typed.length > 0) {
    state.attempts++
    totalWrong++
    wasWrong.value = true
    userInput.value = ''
  }
}

function handleSkip() {
  const idx = currentIndex.value
  const line = getLine(idx)
  if (!line || !line.hasGap) return

  ensureLineState(idx)
  const state = lineState[idx]
  if (state.correct || state.skipped) return

  state.skipped = true
  state.attempts++
  totalWrong++
  wasWrong.value = false
  userInput.value = ''
  emit('startAudio')
}

watch(currentIndex, (newIdx) => {
  userInput.value = ''
  wasWrong.value = false

  const newLine = getLine(newIdx)
  if (newLine?.hasGap) {
    nextTick(() => {
      const el = gapInputEl.value
      if (el && typeof el.focus === 'function') {
        el.focus()
      }
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
    const state = lineState[idx]
    if (state.correct || state.skipped) return

    const nextLine = getLine(idx + 1)
    const lineEndTime = nextLine ? nextLine.time : Infinity

    if (t >= lineEndTime - 0.05) {
      emit('stopAudio')
    }
  }
)

function getSummary() {
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