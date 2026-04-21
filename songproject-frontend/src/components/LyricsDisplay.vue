<template>
	<div class="lyrics-display">
		<div v-if="lines.length === 0" class="no-lyrics">No lyrics available</div>

		<div v-else class="lines">
			<div
				v-for="(line, idx) in lines"
				:key="idx"
				:class="['line', { active: idx === activeIndex }]"
			>
				<span class="time">{{ formatTime(line.time) }}</span>

				<span class="text-before">{{ line.textBefore }}</span>

				<template v-if="line.hasGap">
					<input
						v-model="answers[idx].value"
						@blur="checkAnswer(idx)"
						:class="['gap-input', answers[idx].status]"
						placeholder="..."
					/>
					<span class="text-after">{{ line.textAfter }}</span>
				</template>

				<template v-else>
					<span class="full-text">{{ line.textBefore }}</span>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, reactive, watch, toRefs } from 'vue'
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

// Parsear el contenido del .lrc ya descargado por PlayView
const lines = computed(() => {
	const lrc = props.song?.lrc_content || ''
	return parseLrc(lrc)
})

// Mantener respuestas para las líneas con hueco
const answers = reactive({})

watch(lines, (newLines) => {
	// Inicializar estructura de respuestas
	newLines.forEach((ln, i) => {
		if (ln.hasGap && !answers[i]) {
			answers[i] = { value: '', status: 'pending' }
		}
	})
}, { immediate: true })

function normalizeText(s) {
	return (s || '').trim().toLowerCase()
}

function checkAnswer(i) {
	const ln = lines.value[i]
	if (!ln || !ln.hasGap) return
	const user = normalizeText(answers[i].value)
	const correct = normalizeText(ln.hiddenWord)
	if (user && user === correct) {
		answers[i].status = 'correct'
	} else if (user) {
		answers[i].status = 'wrong'
	} else {
		answers[i].status = 'pending'
	}
}

function getSummary() {
	const newLines = lines.value
	let correct = 0
	let wrong = 0
	newLines.forEach((ln, i) => {
		if (!ln.hasGap) return
		const a = answers[i]
		if (!a || a.status === 'pending') {
			wrong += 1
		} else if (a.status === 'correct') {
			correct += 1
		} else if (a.status === 'wrong') {
			wrong += 1
		}
	})
	return { correct, wrong }
}

defineExpose({ getSummary })

const activeIndex = computed(() => getCurrentLineIndex(props.currentTime, lines.value))

// Formatear tiempo en mm:ss
function formatTime(s) {
	const sec = Math.floor(s || 0)
	const m = Math.floor(sec / 60).toString().padStart(2, '0')
	const ss = (sec % 60).toString().padStart(2, '0')
	return `${m}:${ss}`
}
</script>

<style scoped>
.lyrics-display {
	max-width: 800px;
	margin: 1rem auto;
	text-align: left;
}

.line {
	display: flex;
	gap: 0.5rem;
	align-items: center;
	padding: 0.25rem 0;
}

.line.active {
	background: rgba(59,130,246,0.06);
}

.time {
	width: 3.2rem;
	color: #999;
	font-size: 0.85rem;
}

.gap-input {
	border: none;
	border-bottom: 1px solid #ccc;
	padding: 0.25rem 0.5rem;
	min-width: 120px;
}

.gap-input.correct {
	border-bottom-color: #16a34a;
}

.gap-input.wrong {
	border-bottom-color: #dc2626;
}

.no-lyrics {
	color: #777;
}
</style>
